import { useEffect } from "react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AttackMethods,
  AttackTargets,
  ItemRarities,
  ItemSlotTypes,
  ItemTypes,
} from "@/drizzle/constants";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { effectFilters, statFilters } from "@/libs/train";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { searchItemSchema } from "@/validators/item";
import { Filter } from "lucide-react";
import Toggle from "@/components/control/Toggle";
import { useUserData } from "@/utils/UserContext";
import { canChangeContent } from "@/utils/permissions";
import type { SearchItemSchema } from "@/validators/item";
import type { EffectType } from "@/libs/train";
import type { AttackTarget, ItemType, AttackMethod } from "@/drizzle/constants";
import type { ItemRarity, ItemSlotType } from "@/drizzle/schema";

interface ItemFilteringProps {
  state: ItemFilteringState;
}

const ItemFiltering: React.FC<ItemFilteringProps> = (props) => {
  // Global state
  const { data: userData } = useUserData();

  // Destructure the state
  const { setOnlyInShop, setEventItems } = props.state;
  const { setName, setEffect, setHidden } = props.state;
  const { setItemType, setRarity, setSlot, setMethod, setTarget } = props.state;

  const { itemType, itemRarity, slot, method, target } = props.state;
  const { onlyInShop, eventItems } = props.state;
  const { name, effect, hidden } = props.state;

  // Name search schema
  const form = useForm<SearchItemSchema>({
    resolver: zodResolver(searchItemSchema),
    defaultValues: { name: name },
  });
  const watchName = useWatch({ control: form.control, name: "name", defaultValue: "" });

  // Update the state
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      setName(watchName);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [watchName, setName]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button id="filter-item">
          <Filter className="sm:mr-2 h-6 w-6 hover:text-orange-500" />
          <p className="hidden sm:block">Filter</p>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="grid grid-cols-2 gap-1 gap-x-3">
          {/* Name */}
          <div>
            <Form {...form}>
              <Label>Name</Label>
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="Search items" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </div>

          {/* Item Type */}
          <div>
            <Label>Type</Label>
            <Select value={itemType} onValueChange={setItemType}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY">Any</SelectItem>
                {ItemTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Rarity */}
          <div>
            <Label>Rarity</Label>
            <Select value={itemRarity} onValueChange={setRarity}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY">Any</SelectItem>
                {ItemRarities.map((rarity) => (
                  <SelectItem key={rarity} value={rarity}>
                    {rarity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Slot */}
          <div>
            <Label>Slot</Label>
            <Select value={slot} onValueChange={setSlot}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY">Any</SelectItem>
                {ItemSlotTypes.map((slot) => (
                  <SelectItem key={slot} value={slot}>
                    {slot}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Method */}
          <div>
            <Label>Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY">Any</SelectItem>
                {AttackMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Target */}
          <div>
            <Label>Target</Label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger>
                <SelectValue placeholder="Any" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ANY">Any</SelectItem>
                {AttackTargets.map((target) => (
                  <SelectItem key={target} value={target}>
                    {target}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Effects */}
          <div>
            <Label>Effects</Label>
            <MultiSelect
              selected={effect}
              options={effectFilters.map((ef) => ({ value: ef, label: ef }))}
              onChange={setEffect}
            />
          </div>

          {/* Stats */}
          <div>
            <Label>Stats</Label>
            <MultiSelect
              selected={stat}
              options={statFilters.map((sf) => ({ value: sf, label: sf }))}
              onChange={setStat}
            />
          </div>

          {/* Event Item */}
          <div className="mt-1">
            <Toggle
              verticalLayout
              id="toggle-event-only"
              value={eventItems}
              setShowActive={setEventItems}
              labelActive="Event"
              labelInactive="Non-Event"
            />
          </div>

          {/* Shop Item */}
          <div className="mt-1">
            <Toggle
              verticalLayout
              id="toggle-in-shop"
              value={onlyInShop}
              setShowActive={setOnlyInShop}
              labelActive="In Shop"
              labelInactive="Not in Shop"
            />
          </div>

          {/* Hidden */}
          {userData && canChangeContent(userData.role) && (
            <div className="mt-1">
              <Toggle
                verticalLayout
                id="toggle-hidden-only"
                value={hidden}
                setShowActive={setHidden}
                labelActive="Hidden"
                labelInactive="Non-Hidden"
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ItemFiltering;

/** tRPC filter to be used on api.item.getAll */
export const getFilter = (state: ItemFilteringState) => {
  return {
    name: state.name ? state.name : undefined,
    itemRarity: state.itemRarity !== "ANY" ? state.itemRarity : undefined,
    itemType: state.itemType !== "ANY" ? state.itemType : undefined,
    slot: state.slot !== "ANY" ? state.slot : undefined,
    target: state.target !== "ANY" ? state.target : undefined,
    method: state.method !== "ANY" ? state.method : undefined,
    effect: state.effect.length > 0 ? state.effect : undefined,
    stat: state.stat.length > 0 ? state.stat : undefined,
    eventItems: state.eventItems ? state.eventItems : false,
    onlyInShop: state.onlyInShop ? state.onlyInShop : false,
    hidden: state.hidden ? state.hidden : undefined,
  };
};

/** State for the item Filtering component */
export const useFiltering = () => {
  // State variables
  const [name, setName] = useState<string>("");
  const [itemRarity, setRarity] = useState<(typeof ItemRarities)[number] | "ANY">("ANY");
  const [itemType, setItemType] = useState<(typeof ItemTypes)[number] | "ANY">("ANY");
  const [effect, setEffect] = useState<string[]>([]);
  const [stat, setStat] = useState<string[]>([]);
  const [slot, setSlot] = useState<(typeof ItemSlotTypes)[number] | "ANY">("ANY");
  const [target, setTarget] = useState<(typeof AttackTargets)[number] | "ANY">("ANY");
  const [method, setMethod] = useState<(typeof AttackMethods)[number] | "ANY">("ANY");
  const [eventItems, setEventItems] = useState<boolean | undefined>(false);
  const [onlyInShop, setOnlyInShop] = useState<boolean | undefined>(true);
  const [hidden, setHidden] = useState<boolean | undefined>(false);

  // Return all
  return {
    effect,
    eventItems,
    hidden,
    itemRarity,
    itemType,
    method,
    name,
    onlyInShop,
    setEffect,
    setEventItems,
    setHidden,
    setItemType,
    setMethod,
    setName,
    setOnlyInShop,
    setRarity,
    setSlot,
    setTarget,
    slot,
    stat,
    setStat,
    target,
  };
};

/** State type */
export type ItemFilteringState = ReturnType<typeof useFiltering>;

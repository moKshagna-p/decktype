import { For } from "solid-js";
import { MoreVertical } from "lucide-solid";

import { gameRegistry } from "@/features/games/registry";
import { formatDateTime } from "@/lib/utils";
import type { UserPBs } from "../types";

export function PersonalBestsCards(props: { pbs: UserPBs }) {
  return (
    <div class="flex flex-col gap-6">
      <For each={gameRegistry}>
        {(game) => {
          const gamePBs = props.pbs[game.id] || {};

          return (
            <div class="group relative rounded-xl bg-(--sub-alt) p-6 transition-colors sm:p-8">
              <div class="absolute top-6 right-6 text-(--sub) opacity-20 transition-opacity group-hover:opacity-100 sm:top-8">
                <MoreVertical size={16} />
              </div>

              <div class="flex flex-col gap-6 sm:gap-8">
                <h3 class="text-[10px] font-bold uppercase tracking-[0.2em] text-(--sub) opacity-40">
                  {game.name}
                </h3>

                <div class="flex flex-wrap justify-center gap-x-12 gap-y-8 sm:gap-x-24">
                  <For each={game.difficulties}>
                    {(difficulty) => {
                      const pb = gamePBs[difficulty];

                      return (
                        <div class="flex flex-col items-center gap-1 text-center">
                          <div class="text-[9px] font-bold uppercase tracking-widest text-(--sub) opacity-50">
                            {difficulty}
                          </div>
                          <div
                            class={`text-2xl font-bold leading-none tracking-tighter sm:text-4xl ${
                              !pb ? "text-(--sub) opacity-15" : "text-(--text)"
                            }`}
                          >
                            {pb ? pb.bestScore : "-"}
                          </div>
                          <div class="text-[9px] font-medium tracking-wider text-(--sub) opacity-40">
                            {pb ? (
                              <span>{formatDateTime(pb.createdAt)}</span>
                            ) : (
                              "-"
                            )}
                          </div>
                        </div>
                      );
                    }}
                  </For>
                </div>
              </div>
            </div>
          );
        }}
      </For>
    </div>
  );
}

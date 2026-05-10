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
            <div class="group relative rounded-xl bg-(--sub-alt)/20 p-8 transition-colors hover:bg-(--sub-alt)/30 sm:px-12 sm:py-10">
              <div class="absolute top-10 right-8 text-(--sub) opacity-20 transition-opacity group-hover:opacity-100">
                <MoreVertical size={18} />
              </div>

              <div class="flex flex-col gap-10">
                <h3 class="text-[11px] font-bold uppercase tracking-[0.2em] text-(--sub) opacity-40">
                  {game.name}
                </h3>

                <div class="flex flex-wrap gap-x-12 gap-y-10 sm:gap-x-32">
                  <For each={game.difficulties}>
                    {(difficulty) => {
                      const pb = gamePBs[difficulty];

                      return (
                        <div class="flex flex-col items-center gap-1 text-center">
                          <div class="text-[10px] font-bold uppercase tracking-widest text-(--sub) opacity-50">
                            {difficulty}
                          </div>
                          <div
                            class={`text-4xl font-bold leading-none tracking-tighter sm:text-5xl ${
                              !pb ? "text-(--sub) opacity-15" : "text-(--text)"
                            }`}
                          >
                            {pb ? pb.bestScore : "-"}
                          </div>
                          <div class="text-[10px] font-medium tracking-wider text-(--sub) opacity-40">
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

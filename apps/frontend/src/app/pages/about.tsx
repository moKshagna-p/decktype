import { Button } from "@/components/ui/button";
import { ContributorList } from "@/features/contributors/components/contributor-list";
import { urls } from "@/lib/urls";

function AboutPage() {
  return (
    <div class="w-full flex-1">
      <div class="flex w-full flex-col gap-10">
        <section class="w-full space-y-8">
          <div class="space-y-6">
            <h2 class="text-2xl leading-tight font-bold">About Decktype</h2>

            <div class="space-y-4 text-base leading-normal text-(--sub)">
              <p>
                monkeytype nailed the typing test. decktype asks what comes
                after that. what if the keyboard was a playground instead of a
                benchmark?
              </p>
              <p>
                decktype is an open source collection of typing games, mini
                experiments, and weird ideas built around one belief: typing
                should be fun to explore, not just fast to finish.
              </p>
              <p>
                timed chaos modes, rhythm-based typing, mechanics you've
                genuinely never seen on a typing site. if it felt too fun to not
                build, it's probably in here.
              </p>
              <p>
                open source. fork it, break it, ship your own strange idea into
                it.
              </p>
              <p>
                decktype isn't trying to replace monkeytype. it's the weird side
                project that lives next door and stays up later.
              </p>
            </div>

            <div class="flex flex-wrap gap-3 pt-4">
              <Button href={urls.github} target="_blank" rel="noreferrer">
                decktype github
              </Button>
              <Button
                href="https://monkeytype.com"
                target="_blank"
                rel="noreferrer"
              >
                monkeytype website
              </Button>
              <Button
                href="https://github.com/monkeytypegame/monkeytype"
                target="_blank"
                rel="noreferrer"
              >
                monkeytype github
              </Button>
            </div>
          </div>
        </section>

        <section class="w-full pt-4">
          <ContributorList />
        </section>
      </div>
    </div>
  );
}

export default AboutPage;

export type GameInputProps = {
  ref: (el: HTMLInputElement) => void;
  value: string;
  onInput: (e: InputEvent & { currentTarget: HTMLInputElement }) => void;
  onKeyDown: (e: KeyboardEvent & { currentTarget: HTMLInputElement }) => void;
};

export function GameInput(props: GameInputProps) {
  return (
    <input
      ref={props.ref}
      value={props.value}
      class="sr-only opacity-0"
      autocapitalize="off"
      autocomplete="off"
      autocorrect="off"
      spellcheck={false}
      onInput={props.onInput}
      onKeyDown={props.onKeyDown}
    />
  );
}

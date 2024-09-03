import { Icon, IconName } from '../..';

export function EmptyState() {
  return (
    <figure className="flex flex-col items-center gap-[1.375rem] mx-4 my-auto">
      <Icon name={IconName.box} fill="#0C72D6" size={50} />
      <figcaption className="flex flex-col items-center text-center gap-[0.4375rem] dark:text-black">
        <strong className="font-semibold text-base tracking-[-.01rem]">No channels yet</strong>
        <span className="text-sm tracking-tightest">
          Press the New Channel button to start your GEN AI exploration.
        </span>
      </figcaption>
    </figure>
  );
}

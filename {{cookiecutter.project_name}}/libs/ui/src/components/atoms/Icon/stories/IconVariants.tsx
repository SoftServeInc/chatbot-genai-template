import { IconName, Icon } from '../..';

export function IconVariants() {
  const icons = Object.values(IconName);
  const sets = 5;
  const setLength = Math.round(icons.length / sets);
  const iconsSets = [];

  for (let i = 0; i < sets; i += 1) {
    iconsSets.push(icons.splice(0, setLength));
  }

  return (
    <div className="flex">
      {iconsSets.map((iconsSet, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className="pr-10" key={index}>
            {iconsSet.map((icon, i) => {
              return (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="flex flex-col items-center pb-10">
                  <Icon name={icon} />
                  <span className="mt-2">{icon}</span>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

import { FilterChip } from '../FilterChip';
import { filterChipVariants } from './stubs/filterChipVariants';

export function FilterChipVariants() {
  return (
    <div className="flex">
      {filterChipVariants.map((filterChipSet, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className="flex flex-col items-center pr-5" key={index}>
            {filterChipSet.map((chip) => {
              return (
                <div key={chip.id} className="pb-5">
                  <FilterChip {...chip} />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

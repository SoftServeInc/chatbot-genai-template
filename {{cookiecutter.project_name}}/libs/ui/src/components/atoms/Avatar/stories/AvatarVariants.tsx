import { Avatar } from '..';
import { avatarVariants } from './stubs/avatarVariants';

export function AvatarVariants() {
  return (
    <div className="flex">
      {avatarVariants.map((avatarsSet, index) => {
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div className="flex flex-col items-center pr-5" key={index}>
            {avatarsSet.map((avatar) => {
              return (
                <div key={avatar.id} className="pb-5">
                  <Avatar
                    size={avatar.size}
                    rounded={avatar.rounded}
                    type={avatar.type}
                    src={avatar.src}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

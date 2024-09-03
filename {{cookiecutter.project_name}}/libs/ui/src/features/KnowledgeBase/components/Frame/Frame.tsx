import { UploadedFiles } from '../UploadedFiles';
import { UploadData } from '../UploadData';
import { UserManual } from '../UserManual';

export function Frame() {
  return (
    <div className="flex justify-stretch flex-grow bg-white">
      <div className="w-full p-6 border-r">
        <h3 className="text-base font-normal whitespace-nowrap text-black">
          This a place where all data is stored.
        </h3>
        <div className="mt-4">
          <UploadedFiles />
        </div>
        <div className="mt-4" />
      </div>
      <div className="w-full p-6 border-r">
        <h3 className="text-xl font-medium leading-7 whitespace-nowrap text-black">Upload Data</h3>
        <div className="mt-4">
          <UploadData />
        </div>
      </div>
      <div className="w-full p-6">
        <h3 className="text-xl font-medium leading-7 whitespace-nowrap text-black">
          Gen AI Knowledge
        </h3>
        <div className="mt-4">
          <UserManual />
        </div>
      </div>
    </div>
  );
}

import JsonView from 'react18-json-view';
import 'react18-json-view/src/style.css';
import { WidgetLayout } from '../../../../components/templates';

interface InspectorProps {
  payload: object;
}
export function Inspector({ payload }: InspectorProps) {
  return (
    <WidgetLayout title="Inspector">
      <div className="px-[1.19rem] py-4">
        {payload ? <JsonView src={payload} theme="a11y" displaySize /> : null}
      </div>
    </WidgetLayout>
  );
}

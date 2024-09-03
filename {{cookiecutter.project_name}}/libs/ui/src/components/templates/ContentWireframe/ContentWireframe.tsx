import { cn } from '../../../lib';
import DropdownMenu from '../../../assets/images/dataviz/wireframe/dropdown_menu.svg';
import ProfitRatio from '../../../assets/images/dataviz/wireframe/profit_ratio.svg';
import Sales from '../../../assets/images/dataviz/wireframe/sales.svg';
import Kpi from '../../../assets/images/dataviz/wireframe/kpi.svg';
import Pareo from '../../../assets/images/dataviz/wireframe/pareo.svg';
import Profitability from '../../../assets/images/dataviz/wireframe/profitability.svg';
import Performance from '../../../assets/images/dataviz/wireframe/performance.svg';
import t1 from '../../../assets/images/dataviz/wireframe/3.1.svg';
import t2 from '../../../assets/images/dataviz/wireframe/3.2.svg';
import t3 from '../../../assets/images/dataviz/wireframe/3.3.svg';
import t4 from '../../../assets/images/dataviz/wireframe/3.4.svg';
import t5 from '../../../assets/images/dataviz/wireframe/3.5.svg';
import t6 from '../../../assets/images/dataviz/wireframe/3.6.svg';
import t7 from '../../../assets/images/dataviz/wireframe/3.7.svg';
import f1 from '../../../assets/images/dataviz/wireframe/4.1.svg';
import f2 from '../../../assets/images/dataviz/wireframe/4.2.svg';
import f3 from '../../../assets/images/dataviz/wireframe/4.3.svg';
import f4 from '../../../assets/images/dataviz/wireframe/4.4.svg';
import f5 from '../../../assets/images/dataviz/wireframe/4.5.svg';

interface ContentWireframeProps {
  className?: string;
}
export function ContentWireframe({ className = '' }: ContentWireframeProps) {
  return (
    <figure
      className={cn(
        'mx-7 mt-7 flex justify-start items-start content-start flex-wrap gap-4 pt-4',
        className,
      )}
    >
      <img className="w-1/3 min-[1920px]:w-1/4" src={DropdownMenu} alt="Content Wireframe" />
      <img className="w-full min-[1920px]:w-1/2" src={ProfitRatio} alt="Content Wireframe" />
      <img className="w-0 min-[1920px]:w-full" src={Sales} alt="Content Wireframe" />
      <div className="w-full flex justify-between items-start content-start flex-wrap">
        <div className="w-full min-[1920px]:w-[48%] min-w-[600px] flex justify-between items-start content-start flex-wrap gap-4">
          <img className="w-full lg:w-[48%]" src={Kpi} alt="Content Wireframe" />
          <img className="w-full lg:w-[48%]" src={Pareo} alt="Content Wireframe" />
          <img className="w-full" src={Profitability} alt="Content Wireframe" />
          <img className="w-full" src={Performance} alt="Content Wireframe" />
        </div>
        <div className="w-0 min-[1920px]:w-[24%] min-w-[300px] flex justify-between items-start content-start flex-wrap gap-4">
          <img className="w-[45%]" src={t1} alt="Content Wireframe" />
          <img className="w-[45%]" src={t2} alt="Content Wireframe" />
          <img className="w-[45%]" src={t3} alt="Content Wireframe" />
          <span className="w-[45%] flex flex-col gap-4">
            <img className="w-full" src={t4} alt="Content Wireframe" />
            <img className="w-full" src={t5} alt="Content Wireframe" />
          </span>
          <img className="w-full" src={t6} alt="Content Wireframe" />
          <img className="w-full" src={t7} alt="Content Wireframe" />
        </div>
        <div className="w-0 min-[1920px]:w-[24%] min-w-[300px] flex justify-between items-start content-start flex-wrap gap-4">
          <img className="w-full" src={f1} alt="Content Wireframe" />
          <img className="w-full" src={f2} alt="Content Wireframe" />
          <img className="w-[45%]" src={f3} alt="Content Wireframe" />
          <img className="w-[45%]" src={f4} alt="Content Wireframe" />
          <img className="w-full" src={f5} alt="Content Wireframe" />
        </div>
      </div>
    </figure>
  );
}

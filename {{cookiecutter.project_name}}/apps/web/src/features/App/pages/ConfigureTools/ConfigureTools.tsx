import { useNavigate } from 'react-router-dom';
import { PageLayout, BotExplorerConfigType, BotExplorerConfig, BotExplorerConfigForm } from 'ui';

export function ConfigureTools() {
  const navigate = useNavigate();

  const handleSubmit = (config: BotExplorerConfigType) => {
    BotExplorerConfig.create(config);
    navigate('/app/tools/bot-explorer');
  };

  return (
    <PageLayout className="bg-white">
      <div className="w-[38.125rem] mt-[18.19rem] mx-auto flex flex-col">
        <header className="mb-[1.88rem] text-center dark:text-black">
          <h1 className="text-[2.5rem] leading-[4rem] tracking-[-.1rem] font-bold">Bot Explorer</h1>
          <h3 className="text-2xl/[2.25rem] tracking-[-.03rem] font-normal text-neutral-04-100">
            Development mode access
          </h3>
        </header>
        <BotExplorerConfigForm
          className="w-full"
          options={{
            baseURL: '',
            accessToken: '',
          }}
          onSubmit={handleSubmit}
        />
      </div>
    </PageLayout>
  );
}

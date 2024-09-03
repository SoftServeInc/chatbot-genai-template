import { useNavigate } from 'react-router-dom';
import { BotExplorerConfig, BotExplorerConfigType, BotExplorerConfigForm } from 'ui';

export function ConfigureBotExplorer() {
  const navigate = useNavigate();

  const handleSubmit = (config: BotExplorerConfigType) => {
    BotExplorerConfig.create(config);
    navigate('/tools/bot-explorer');
  };

  return (
    <BotExplorerConfigForm
      className="w-full"
      options={{
        baseURL: '',
        accessToken: '',
      }}
      onSubmit={handleSubmit}
    />
  );
}

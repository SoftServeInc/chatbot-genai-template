import { v4 as uuid } from 'uuid';
import { IconName } from '../../src/components/atoms';
import { ChatAction } from '../../src/components/molecules/ChatActions';
import { MessageAuthor, MessageType } from '../../src/types';

const capabilities = [
  { question: '<b>What</b> is the speed of light?' },
  { question: '<b>Why</b> the sky is blue?' },
  { question: '<b>How</b> do airplanes fly?' },
  { question: '<b>Who</b> is inventor of The World Wide Web?' },
  { question: '<b>When</b> is the largest day?' },
];

const actions: ChatAction[] = [
  { icon: IconName.edit, name: 'Edit', action: () => console.log('Edit clicked') },
  { icon: IconName.delete, name: 'Delete', action: () => console.log('Delete clicked') },
];

const header = {
  title: 'Chatbot Assistant',
  className: 'text-xl/8 font-semibold tracking-tight',
};

const messages = [
  {
    id: uuid(),
    created_at: new Date().toISOString(),
    segments: [
      {
        content: 'What benefits GenAI can provide for modern companies and business?',
        type: MessageType.text,
      },
    ],
    role: MessageAuthor.user,
    feedback_rating: 0,
  },
  {
    id: uuid(),
    created_at: new Date().toISOString(),
    segments: [
      {
        content: `GenAI, or Generative AI, offers a wide range of benefits for modern companies and businesses across various industries. Here are some key advantages:\n* **Enhanced Creativity and Innovation**: GenAI can generate novel ideas, designs, and solutions, pushing the boundaries of creativity. This is particularly useful in fields like marketing, product design, and content creation.\n* **Efficiency and Automation**: Routine and repetitive tasks can be automated using GenAI, freeing up human resources for more complex and strategic activities. This includes data entry, basic customer service interactions, and even coding.\n* **Data Analysis and Insights**: GenAI can process and analyze large volumes of data more quickly and accurately than humans, providing valuable insights for decision-making in areas like market trends, customer behavior, and operational efficiencies.\n* **Personalization**: Businesses can use GenAI to offer highly personalized experiences to customers, from tailored product recommendations to individualized marketing messages, enhancing customer satisfaction and loyalty.\n* **Cost Reduction**: By automating tasks and improving efficiency, GenAI can help reduce operational costs. It also minimizes errors and improves quality, which can lead to cost savings in the long run.\n* **Scalability**: GenAI systems can handle increasing amounts of work or data without a corresponding increase in costs, making it easier for businesses to scale up.\n* **Enhanced Customer Service**: Chatbots and virtual assistants powered by GenAI can provide instant, 24/7 customer service, handling inquiries, complaints, and providing information, which improves customer experience and frees up human agents for more complex issues.\n* **Risk Management**: In sectors like finance and healthcare, GenAI can help in predicting and managing risks by analyzing patterns and trends that might be too complex for human analysts to detect quickly.\n* **Content Generation**: For creative industries, GenAI can generate written content, music, art, and even video, which can be used for advertising, entertainment, or as a basis for further creative work.\n* **Research and Development**: GenAI can accelerate R&amp;D processes by simulating experiments, predicting outcomes, and suggesting improvements, which is particularly beneficial in fields like pharmaceuticals, engineering, and technology.\n* **Supply Chain Optimization**: GenAI can optimize supply chain logistics by predicting demand, managing inventory, and identifying the most efficient routes and methods for distribution.\n* **Training and Education**: GenAI can be used to create personalized training programs for employees, adapting to their learning style and pace, which improves the effectiveness of training and development.\n* **Language Translation and Localization**: GenAI can rapidly translate content into multiple languages, making it easier for businesses to operate globally and connect with a diverse customer base.\n* **Ethical and Sustainable Practices**: By analyzing data and trends, GenAI can help companies in making more ethical and sustainable decisions, aligning with social responsibility goals.\n* **Competitive Advantage**: Early adopters of GenAI can gain a significant competitive advantage by improving their products and services, optimizing their operations, and offering unique customer experiences.\n\nAs GenAI technology continues to evolve, it's likely that even more applications and benefits will emerge, further transforming the business landscape.`,
        type: MessageType.text,
      },
    ],
    role: MessageAuthor.assistant,
    feedback_rating: 1,
  },
];

export const ChatMock = {
  id: uuid(),
  className: '',
  rounded: 2,
  capabilities,
  header,
  actions,
  messages,
};

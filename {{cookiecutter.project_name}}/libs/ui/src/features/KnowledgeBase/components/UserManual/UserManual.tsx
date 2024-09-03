import styles from './styles.module.scss';

export function UserManual() {
  const info = [
    {
      title: 'Upload data',
      description: 'Give me some data to learn from. This can be a text document (PDF).',
    },
    {
      title: 'Give me some time to learn',
      description:
        'I will need 5-10 min to get acquainted with your data and create knowledge from it.',
    },
    {
      title: 'Ask me a question',
      description: "Afterwards I'll be able to answer your questions on the documents content.",
    },
  ];

  return (
    <div>
      <p className="mb-6 font-normal text-sm text-black">
        You can teach me new things and I&apos;ll be glad to support you.
      </p>
      <ol className={styles.userManual}>
        {info.map(({ title, description }) => (
          <li className="mb-6 font-normal text-sm text-black" key={title}>
            <p className="font-bold">{title}</p>
            <span>{description}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

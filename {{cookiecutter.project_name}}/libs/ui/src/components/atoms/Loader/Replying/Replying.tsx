import styles from './styles.module.scss';

interface ReplyingProps {
  className?: string;
}
export function Replying({ className = '' }: ReplyingProps) {
  return (
    <div className={`${styles.loader} ${className}`}>
      <span />
      <span />
      <span />
    </div>
  );
}

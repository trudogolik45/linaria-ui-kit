import type { ButtonHTMLAttributes } from 'react';
import styles from './CssModulesButton.module.css';

export function CssModulesButton(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type="button" className={styles.button} {...props} />;
}

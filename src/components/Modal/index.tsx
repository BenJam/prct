/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useRef, useEffect, Dispatch, SetStateAction } from "react";
import styles from "./Modal.module.css";

type Props = {
  heading: string;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  content: JSX.Element;
  actions?: JSX.Element;
};

export const Modal: React.FC<Props> = ({
  heading,
  setIsOpen,
  content,
  actions,
}: Props) => {
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (closeRef.current) {
      closeRef.current.focus();
    }
  }, []);

  return (
    <>
      <div className={styles.darkBG} onClick={() => setIsOpen(false)} />
      <div className={styles.centered}>
        <div className={styles.modal}>
          <div className={styles.modalHeader}>
            <h5 className={styles.heading}>{heading}</h5>
            <button
              type="button"
              ref={closeRef}
              className={styles.closeBtn}
              onClick={() => setIsOpen(false)}
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
          <div className={styles.modalContent}>{content}</div>
          <div className={styles.modalActions}>
            <div className={styles.actionsContainer}>
              {actions || (
                <>
                  <button
                    type="button"
                    className={styles.joinBtn}
                    onClick={() => setIsOpen(false)}
                  >
                    <i className="fa-solid fa-plus" /> Join
                  </button>
                  <button
                    type="button"
                    className={styles.cancelBtn}
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

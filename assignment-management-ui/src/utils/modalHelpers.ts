export const closeModal = (
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  setItemToDelete: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setShowModal(false);
  setItemToDelete(null);
};

export const confirmCancel = (
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: (path: number) => void
) => {
  setShowModal(false);
  navigate(-1);
};

export const handleCancel = (
  isDirty: boolean,
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: (path: number) => void
) => {
  if (isDirty) {
    setShowModal(true);
  } else {
    navigate(-1);
  }
};

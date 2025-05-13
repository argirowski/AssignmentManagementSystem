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

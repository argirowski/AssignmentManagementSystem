export const closeModal = (
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>,
  setItemToDelete: React.Dispatch<React.SetStateAction<string | null>>
) => {
  setShowModal(false);
  setItemToDelete(null);
};

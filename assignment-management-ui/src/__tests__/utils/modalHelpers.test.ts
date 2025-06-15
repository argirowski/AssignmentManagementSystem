import {
  closeModal,
  confirmCancel,
  handleCancel,
} from "../../utils/modalHelpers";

describe("modalHelpers", () => {
  it("closeModal sets modal to false and item to null", () => {
    const setShowModal = jest.fn();
    const setItemToDelete = jest.fn();
    closeModal(setShowModal, setItemToDelete);
    expect(setShowModal).toHaveBeenCalledWith(false);
    expect(setItemToDelete).toHaveBeenCalledWith(null);
  });

  it("confirmCancel sets modal to false and navigates back", () => {
    const setShowModal = jest.fn();
    const navigate = jest.fn();
    confirmCancel(setShowModal, navigate);
    expect(setShowModal).toHaveBeenCalledWith(false);
    expect(navigate).toHaveBeenCalledWith(-1);
  });

  it("handleCancel shows modal if dirty", () => {
    const setShowModal = jest.fn();
    const navigate = jest.fn();
    handleCancel(true, setShowModal, navigate);
    expect(setShowModal).toHaveBeenCalledWith(true);
    expect(navigate).not.toHaveBeenCalled();
  });

  it("handleCancel navigates if not dirty", () => {
    const setShowModal = jest.fn();
    const navigate = jest.fn();
    handleCancel(false, setShowModal, navigate);
    expect(setShowModal).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(-1);
  });
});

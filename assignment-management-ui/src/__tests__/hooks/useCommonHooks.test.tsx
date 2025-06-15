import { renderHook } from "@testing-library/react";
import { useCommonHooks } from "../../hooks/useCommonHooks";
import * as reactRedux from "react-redux";
import * as reactRouterDom from "react-router-dom";

jest.mock("react-redux");
jest.mock("react-router-dom");

describe("useCommonHooks", () => {
  it("returns params, dispatch, and navigate", () => {
    const mockParams = { id: "123" };
    const mockDispatch = jest.fn();
    const mockNavigate = jest.fn();
    (reactRouterDom.useParams as jest.Mock).mockReturnValue(mockParams);
    (reactRedux.useDispatch as unknown as jest.Mock).mockReturnValue(
      mockDispatch
    );
    (reactRouterDom.useNavigate as jest.Mock).mockReturnValue(mockNavigate);

    // @ts-ignore
    const { result } = renderHook(() => useCommonHooks());
    expect(result.current.params).toBe(mockParams);
    expect(result.current.dispatch).toBe(mockDispatch);
    expect(result.current.navigate).toBe(mockNavigate);
  });
});

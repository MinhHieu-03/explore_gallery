import { render, screen, fireEvent } from "@testing-library/react";
import SearchFilter from "../SearchFilterBar";
import React from "react";

describe("SearchFilterBar", () => {
  it("gọi onCategoryChange khi chọn category mới", () => {
    const mockChange = jest.fn();
    render(
      <SearchFilter
        query=""
        onQueryChange={() => {}}
        category="all"
        onCategoryChange={mockChange}
        sort="latest"
        onSortChange={() => {}}
        onCreateClick={() => {}}
      />
    );

    fireEvent.change(screen.getByLabelText("Filter by category"), {
      target: { value: "Animals" },
    });

    expect(mockChange).toHaveBeenCalledWith("Animals");
  });
});

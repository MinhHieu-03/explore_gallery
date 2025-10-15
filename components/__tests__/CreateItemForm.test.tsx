import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateItemForm from "../CreateItemForm";

describe("CreateItemForm", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("gọi onSubmit với dữ liệu hợp lệ", async () => {
    const mockSubmit = jest.fn();
    render(<CreateItemForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByPlaceholderText("Enter title"), {
      target: { value: "New Cat Photo" },
    });

    fireEvent.change(screen.getByPlaceholderText("https://example.com/photo.jpg"), {
      target: { value: "https://example.com/cat.jpg" },
    });

    fireEvent.change(screen.getByLabelText("Category *"), {
      target: { value: "Animals" },
    });

    fireEvent.change(screen.getByLabelText("Description *"), {
      target: { value: "Cute cat in the garden" },
    });

    fireEvent.click(screen.getByText("Create Item"));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "New Cat Photo",
          image: "https://example.com/cat.jpg",
          category: "Animals",
          description: "Cute cat in the garden",
        })
      );
    });
  });

  it("hiển thị lỗi nếu thiếu trường bắt buộc", async () => {
    const mockSubmit = jest.fn();
    render(<CreateItemForm onSubmit={mockSubmit} />);

    fireEvent.click(screen.getByText("Create Item"));

    expect(await screen.findByText("Title is required.")).toBeInTheDocument();
    expect(await screen.findByText("Image URL is required.")).toBeInTheDocument();
    expect(await screen.findByText("Category is required.")).toBeInTheDocument();
    expect(await screen.findByText("Description is required.")).toBeInTheDocument();
    expect(mockSubmit).not.toHaveBeenCalled();
  });
});

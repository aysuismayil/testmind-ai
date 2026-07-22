import { render, screen } from "@testing-library/react";
import { PriorityBadge } from "@/components/priority-badge";

describe("PriorityBadge", () => {
  it("renders the given priority label", () => {
    render(<PriorityBadge priority="High" />);
    expect(screen.getByText("High")).toBeInTheDocument();
  });

  it("renders Low priority", () => {
    render(<PriorityBadge priority="Low" />);
    expect(screen.getByText("Low")).toBeInTheDocument();
  });
});

import { clearHistory, deleteHistoryItem, getHistory, getHistoryItem, saveToHistory, updateHistoryItem } from "@/lib/storage/history";
import { generateMockReport } from "@/lib/ai/mock-provider";

describe("history storage (localStorage)", () => {
  beforeEach(() => {
    clearHistory();
  });

  it("returns an empty array when there is no history", () => {
    expect(getHistory()).toEqual([]);
  });

  it("saves and retrieves a report", () => {
    const report = generateMockReport("As a user, I want to reset my password.");
    saveToHistory(report);
    expect(getHistory()).toHaveLength(1);
    expect(getHistoryItem(report.id)?.id).toBe(report.id);
  });

  it("puts the most recently saved report first", () => {
    const first = generateMockReport("First requirement");
    const second = generateMockReport("Second requirement");
    saveToHistory(first);
    saveToHistory(second);
    expect(getHistory()[0].id).toBe(second.id);
  });

  it("updates an existing history item in place", () => {
    const report = generateMockReport("As a user, I want to export data.");
    saveToHistory(report);
    const edited = { ...report, title: "Edited title" };
    updateHistoryItem(edited);
    expect(getHistory()).toHaveLength(1);
    expect(getHistoryItem(report.id)?.title).toBe("Edited title");
  });

  it("deletes a history item", () => {
    const report = generateMockReport("As a user, I want to delete my account.");
    saveToHistory(report);
    deleteHistoryItem(report.id);
    expect(getHistory()).toHaveLength(0);
  });

  it("clears all history", () => {
    saveToHistory(generateMockReport("A"));
    saveToHistory(generateMockReport("B"));
    clearHistory();
    expect(getHistory()).toEqual([]);
  });
});

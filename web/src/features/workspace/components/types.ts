export type WorkspaceItemData = {
  id: string;
  name: string;
};

export type WorkspaceOwnerOption = {
  id: string;
  name: string;
};

export type WorkspaceViewState = "loading" | "ready" | "empty" | "error";

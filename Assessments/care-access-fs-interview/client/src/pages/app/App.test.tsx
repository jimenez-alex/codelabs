import { render, screen } from "@testing-library/react";

import { App } from "./App";

// Mocked Api calls module to prevent changes to production
jest.mock("../users/components/userapi/UserApi", () => ({
  getUsers: jest.fn(),
  createUser: jest.fn(),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
  emailRegex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}));

test("renders learn react link", () => {
  render(<App />);
  const linkElement = screen.getByText(/Welcome to Kyruus/i);
  expect(linkElement).toBeInTheDocument();
});

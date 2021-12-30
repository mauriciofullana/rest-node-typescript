import { object, string, TypeOf } from "zod";

export const createSessionSchema = object({
  body: object({
    password: string({
      required_error: "Password is required",
    }).min(6, "Password to short - should be 6 chars minimun"),
    email: string({
      required_error: "Email is required",
    }).email("Not a valid email"),
  }),
});

// export type CreateUserInput = Omit<
//   TypeOf<typeof createUserSchema>,
//   "body.passwordConfirmation"
// >;

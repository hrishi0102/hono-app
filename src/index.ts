import { Hono, Next } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { env } from "hono/adapter";

const app = new Hono();

async function MiddleAuth(c: any, next: any) {
  if (c.req.header("Authorization")) {
    // Do validation
    await next();
  } else {
    return c.text("You dont have acces");
  }
}
// app.use(MiddleAuth);

// app.post("/", async (c) => {
//   const body = await c.req.parseBody();
//   console.log(body);
//   console.log(c.req.header("Authorization"));
//   console.log(c.req.query("param"));

//   return c.text("Hello Hono!");
// });

app.get("/", async (c) => {
  return c.text("Hello Hono!");
});

//Database Connection
app.post("/", async (c) => {
  // Todo add zod validation here
  const body: {
    name: string;
    email: string;
    password: string;
  } = await c.req.json();
  const { DATABASE_URL } = env<{ DATABASE_URL: string }>(c);

  const prisma = new PrismaClient({
    datasourceUrl: DATABASE_URL,
  }).$extends(withAccelerate());

  console.log(body);

  const response = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: body.password,
    },
  });

  console.log(JSON.stringify(response));

  return c.json({ msg: "as" });
});

export default app;

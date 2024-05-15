import { Hono } from "hono";

const app = new Hono();

async function MiddleAuth(c: any, next: any) {
  if (c.req.header("Authorization")) {
    // Do validation
    await next();
  } else {
    return c.text("You dont have acces");
  }
}
app.use(MiddleAuth);

app.post("/", async (c) => {
  const body = await c.req.parseBody();
  console.log(body);
  console.log(c.req.header("Authorization"));
  console.log(c.req.query("param"));

  return c.text("Hello Hono!");
});

export default app;

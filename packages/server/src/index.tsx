import { serve } from "@hono/node-server";
import { Hono } from "hono";
import fs from "fs";
import { drizzle } from "drizzle-orm/libsql";
import { migrate } from "drizzle-orm/libsql/migrator";
import type { PostT } from "./schema/suitPost.js";
import { eq } from "drizzle-orm";
import type { FC } from "hono/jsx";
import { cors } from "hono/cors";
import { type VocabularyT, Vocabulary, Post, insertVocabularySchema } from "./db/schema.js";
import { like } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";

const db = drizzle(process.env.DB_FILE_NAME || "file:group.db");

(async function initializeDatabase(): Promise<void> {
  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("数据库检查迁移完成");
  } catch (error) {
    if (!(error instanceof Error && error.message.includes("already exists"))) {
      throw error;
    }
  }
})();

(async function importData(): Promise<void> {
  if (!fs.existsSync("suits.json")) {
    return;
  }
  const data = JSON.parse(fs.readFileSync("suits.json", "utf-8"));
  // "id":223951001,"name":"小小焦虑猫","description":"本装扮预留编号1-5～","startTime":1724731200,"totalPurchaseCount":13,"user":3546387199298339,"username":"繁楼科技","owner":3546387199298339,"image_cover":"https://i0.hdslb.com/bfs/garb/5f5fc8e60c6a8ff9b83e55e2c658afe90b61bb5d.jpg"}
  const posts = data.map(
    (post: {
      id: number;
      name: string;
      description: string;
      startTime: number;
      totalPurchaseCount: number;
      user: number;
      username: string;
      owner: number;
      image_cover: string;
    }) => ({
      id: post.id,
      name: post.name,
      description: post.description,
      startTime: post.startTime,
      totalPurchaseCount: post.totalPurchaseCount,
      user: post.user,
      username: post.username,
      owner: post.owner,
      image_cover: post.image_cover,
    })
  );

  await db.insert(Post).values(posts).execute();
  console.log("数据导入完成");
  fs.renameSync("suits.json", "suits.imported.json");
})();

export class postController {
  async getPosts(): Promise<PostT[] | null> {
    const result = await db.select().from(Post);
    return result || null;
  }

  async getPostById(id: number): Promise<PostT | null> {
    const result = await db.select().from(Post).where(eq(Post.id, id));
    return result[0] || null;
  }
}


export class vocabularyController {
  async getVocabularys(keyword?: string): Promise<VocabularyT[] | null> {
    let result;
    if (keyword) {
      result = await db
        .select()
        .from(Vocabulary)
        .where(like(Vocabulary.original, `%${keyword}%`));
    } else {
      result = await db.select().from(Vocabulary);
    }
    return result || null;
  }

  async getVocabularyById(id: number): Promise<VocabularyT | null> {
    const result = await db
      .select()
      .from(Vocabulary)
      .where(eq(Vocabulary.id, id));
    return result[0] || null;
  }

  async createVocabulary(vocabulary: VocabularyT): Promise<VocabularyT | null> {
    const result = await db.insert(Vocabulary).values(vocabulary).returning();
    return result[0] || null;
  }

  async updateVocabulary(
    id: number,
    vocabulary: VocabularyT
  ): Promise<VocabularyT | null> {
    const result = await db
      .update(Vocabulary)
      .set(vocabulary)
      .where(eq(Vocabulary.id, id))
      .returning();
    return result[0] || null;
  }

  async deleteVocabulary(id: number): Promise<VocabularyT | null> {
    const result = await db
      .delete(Vocabulary)
      .where(eq(Vocabulary.id, id))
      .returning();
    return result[0] || null;
  }
}
const postControllerInstance = new postController();
const vocabularyControllerInstance = new vocabularyController();

// 初始化应用
const app = new Hono({
  // 配置
});

app.use("/api/*", cors());

// 获取所有帖子
app.get("/api/posts", async (c) => {
  const posts = await postControllerInstance.getPosts();
  return c.json(posts);
});

// 获取单个帖子
app.get("/api/posts/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const post = await postControllerInstance.getPostById(id);
  return c.json(post);
});

// 获取所有单词
app.get("/api/vocabularys", async (c) => {
  const keyword = c.req.query('keyword');
  const vocabularys = await vocabularyControllerInstance.getVocabularys(keyword);
  return c.json(vocabularys);
});

// 根据ID获取单词
app.get("/api/vocabularies/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const vocabulary = await vocabularyControllerInstance.getVocabularyById(id);
  return c.json(vocabulary);
});

// 创建单词
app.post("/api/vocabularies", async (c) => {
  try {
    const vocabulary = await c.req.json<VocabularyT>();
    const result = await vocabularyControllerInstance.createVocabulary(vocabulary);
    return c.json(result);
  } catch (error) {
    console.error('创建单词失败:', error);
    throw new HTTPException(400, { message: '创建单词失败' });
  }
});

// 更新单词
app.put("/api/vocabularies/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    const vocabulary = await c.req.json<VocabularyT>();
    vocabulary.tags = String(vocabulary.tags);
    const validate_vocabulary = insertVocabularySchema.parse(vocabulary);
    const result = await vocabularyControllerInstance.updateVocabulary(id, validate_vocabulary);
    return c.json(result);
  } catch (error) {
    console.error('更新单词失败:', error);
    throw new HTTPException(400, { message: '更新单词失败' });
  }
});

// 删除单词
app.delete("/api/vocabularies/:id", async (c) => {
  try {
    const id = parseInt(c.req.param("id"), 10);
    const result = await vocabularyControllerInstance.deleteVocabulary(id);
    return c.json(result);
  } catch (error) {
    console.error('删除单词失败:', error);
    throw new HTTPException(400, { message: '删除单词失败' });
  }
});

app.onError((err, c) => {
  console.error(err.message);
  if (err instanceof HTTPException) {
    return err.getResponse();
  }
  return c.json({ message: '服务器内部错误' }, 500);
});

const Layout: FC = (props) => {
  return (
    <html>
      <head>
        <title>HONO API 后端</title>
        <script src="https://cdn.tailwindcss.com"></script>
      </head>
      <body class="bg-slate-50 flex flex-col">{props.children}</body>
    </html>
  );
};

const CardItem: FC<{ title: string; children: any }> = (props) => {
  return (
    <div class="bg-slate-300 p-4 w-full rounded-md shadow-md m-4 border border-slate-400 hover:bg-slate-200 transition-colors">
      <h2 class="text-2xl font-bold">{props.title}</h2>
      <p>{props.children}</p>
    </div>
  );
};

const Top: FC<{
  routers: { api: string; desc: string; method: string }[];
}> = (props: { routers: { api: string; desc: string; method: string }[] }) => {
  return (
    <Layout>
      <h1 class="ml-8 mt-4 text-3xl hover:translate-x-2 transition-transform">
        HONO API 后端
      </h1>
      <div class="flex max-w-lg min-w-md ml-4">
        <ul class="w-full">
          {props.routers.map((router) => (
            <li class="w-full animate-in hover:translate-x-2 transition-transform">
              <CardItem title={router.api}>
                <p>{router.desc}</p>
                <p>请求方式: {router.method}</p>
              </CardItem>
            </li>
          ))}
        </ul>
      </div>
    </Layout>
  );
};

// 首页的所有提示
app.get("/", async (c) => {
  const routers = [
    { api: "/posts", desc: "获取所有帖子", method: "GET" },
    { api: "/posts/:id", desc: "获取单个帖子", method: "GET" },
  ];
  return c.html(<Top routers={routers} />);
});

const port = 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});

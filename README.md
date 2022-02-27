This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## このリポジトリについて

- ISRの挙動の確認用のリポジトリ

## 確認したこと
- revalidateに指定した値の間はキャッシュを保持する
- revalidateに指定した値を過ぎた後にリクエストしたらページが再生成される（最初にアクセスしたタイミングは古いぺーじだけど次から新しいページが返されるようになる）
- unstable_revalidate を実行したら、新しいページが再生成される。unstable_revalidateを実行以降にリクエストしたら再生成したページが返される
## Getting Started

```bash
$ yarn install
$ yarn build
$ yarn start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


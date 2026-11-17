export function request(ctx) {
  const { ingredients = [] } = ctx.args;

  const prompt = `Suggest a recipe idea using these ingredients: ${ingredients.join(", ")}.`;

  return {
    resourcePath: `/model/us.amazon.nova-2-lite-v1:0/invoke`,
    method: "POST",
    params: {
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: [{ text: prompt }],
          },
        ],
        inferenceConfig: {
          maxTokens: 1000,
        },
      }),
    },
  };
}

export function response(ctx) {
  if (ctx.error) {
    util.error(ctx.error.message, ctx.error.type);
  }
  const parsedBody = JSON.parse(ctx.result.body);
  if (ctx.result.statusCode !== 200) {
    util.error(parsedBody.message || ctx.result.body, "BedrockError");
  }
  const contentList = parsedBody.output.message.content;
  const textBlock = contentList.find((block) => block.text);
  return {
    body: textBlock ? textBlock.text : "",
  };
}
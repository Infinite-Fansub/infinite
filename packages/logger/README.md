# Examples

## Logger

<u>*Disclaimer:*</u> The memory usage and date shown on the examples will differ from yours

<u>**Disclaimer 2:**</u> The gradients on the readme might deffer from the real ones because of html x ansi colors

### Simple Usage

#### Default Print

```ts
import { Logger } from "@infinite-fansub/logger";

new Logger().defaultPrint("Message to log");
```

**Output:**

![](./imgs/default-log.png)

#### Error

```ts
import { Logger } from "@infinite-fansub/logger";

new Logger().error("Error Message");
```

**Output:**

![](./imgs/error-log.png)

#### Infinite Print

```ts
import { Logger } from "@infinite-fansub/logger";

new Logger().infinitePrint("Message to log");
```

**Output:**

![](./imgs/infinite-log.png)

#### Print

```ts
import { Logger } from "@infinite-fansub/logger";
import { Color } from "colours.js";

new Logger().print("Message to log", Color.fromHex("#FF7300"));
```

**Output:**

![](./imgs/colored-log.png)

### More in Depth

| Option     | Type              | Description                                             | Default                                                                                                                                                  |
| ---------- | ----------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| colors     | `Partial<Colors>` | Change the colors                                       | ```{ color: #FF00EF, templateColor: #00DDFF, errorColor: #FF0000, templateErrorColor: #8C00FF, gradientPrimary: #0048FF, gradientSecondary: #C603FC }``` |
| emojis     | `Partial<Emojis>` | Change the default emojis                               | ```{ emoji: 💫, errorEmoji: ❌ }```                                                                                                                        |
| showMemory | boolean           | Decides wether to show the memory before the log or not | true                                                                                                                                                     |

#### T

## Error Logger

### Simple Usage

```ts
import { ErrorLogger } from "@infinite-fansub/logger";

throw new ErrorLogger("Error Message");
```

**Output:**

![](./imgs/simple-error.png)

### More in Depth

| Option            | Type                                            | Description                                                                   | Default |
| ----------------- | ----------------------------------------------- | ----------------------------------------------------------------------------- | ------- |
| errCode           | `string \| number`                              | String/number that gets added after the `error` on the error string           |         |
| ref               | `boolean`                                       | Decides wether it shows where the error was defined or where it was generated | false   |
| lines             | `Array<{ err: string, marker: MarkerOptions }>` | Adds lines to the error, the marker is what appears before the message        |         |
| showNormalMessage | `boolean`                                       | Decides where to show the line where the error was generated                  | true    |

#### MarkerOptions

| Option | Type    | Description                                             |
| ------ | ------- | ------------------------------------------------------- |
| text   | string  | The text that will appear on the marker                 |
| color  | color   | The color of the marker                                 |
| spaced | boolean | Adds a line break before the marker                     |
| nl     | boolean | Adds a line break between the marker and the line error |

#### Using `ref`

```ts
import { ErrorLogger } from "@infinite-fansub/logger";

/*
* We are going to wrap the error inside a function to show the option `ref`,
* `ref` is used so it tells you where the error was generated which in this case will be the function call
* instead of returning where the error is defined
*/

function test() {
    throw new ErrorLogger("Error Message", {
        errCode: 403,
        ref: true
    });
};

test()
```

**Output:**

![](./imgs/ref-error.png)

#### Adding Lines

```ts
import { ErrorLogger } from "@infinite-fansub/logger";

throw new ErrorLogger("Error Message", {
    lines: [
        {
            err: "Another error message",
            marker: { text: "Custom mark", spaced: true }
        }
    ]
});
```

**Output:**

![](./imgs/lines-error.png)

#### Using `showNormalMessage`

```ts
throw new ErrorLogger("Error Message", {
    showNormalMessage: false,
    lines: [
        {
            err: "Another error message",
            marker: { text: "Custom mark", spaced: true }
        }
    ]
});
```

**Output:**

![](./imgs/show-default-error.png)
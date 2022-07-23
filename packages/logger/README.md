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

<pre>
<span style=color:#FF0000>117.81/140.67MB</span> <span style=background-color:#F5F5F5;color:#000000>[19:36:43]</span> 💫 <span style=color:#FF00EF>Message to log</span>
</pre>

#### Error

```ts
import { Logger } from "@infinite-fansub/logger";

new Logger().error("Error Message");
```

**Output:**

<pre>
<span style=color:#FF0000>117.81/140.67MB</span> <span style=background-color:#F5F5F5;color:#000000>[19:36:43]</span> ❌ <span style=color:#FF0000>Error Message</span>
</pre>

#### Infinite Print

```ts
import { Logger } from "@infinite-fansub/logger";

new Logger().infinitePrint("Message to log");
```

**Output:**

<pre>
<span style=color:#FF0000>117.81/140.67MB</span> <span style=background-color:#F5F5F5;color:#000000>[19:36:43]</span> 💫 <span style=background:linear-gradient(90deg,#C603FC,#0048FF);background-clip:text;-webkit-background-clip:text;-webkit-text-fill-color:transparent;>Message to log</span>
</pre>

#### Print

```ts
import { Logger } from "@infinite-fansub/logger";
import { Color } from "colours.js";

new Logger().print("Message to log", Color.fromHex("#FF7300"));
```

**Output:**

<pre>
<span style=color:#FF0000>117.81/140.67MB</span> <span style=background-color:#F5F5F5;color:#000000>[19:36:43]</span> 💫 <span style=color:#FF7300>Message to log</span>
</pre>

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

<pre>
<span style=color:#00B9FF>index.ts</span>:<span style=color:#FFE000>3</span>:<span style=color:#FFE000>7</span> - <span style=color:#FF0000>error</span>: Error Message
<span style=background-color:#F5F5F5;color:#000000>3</span> throw new ErrorLogger("Error Message");
        ^
</pre>

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

<pre>
<span style=color:#00B9FF>index.ts</span>:<span style=color:#FFE000>16</span>:<span style=color:#FFE000>1</span> - <span style=color:#FF0000>error</span> <span style=color:#767676>403</span>: Error Message
<span style=background-color:#F5F5F5;color:#000000>16</span> test()
   ^
</pre>

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

<pre>
<span style=color:#00B9FF>index.ts</span>:<span style=color:#FFE000>3</span>:<span style=color:#FFE000>7</span> - <span style=color:#FF0000>error</span>: Error Message
<span style=background-color:#F5F5F5;color:#000000>3</span> throw new ErrorLogger("Error Message", {
        ^
<span style=background-color:#F5F5F5;color:#000000>Custom mark</span> Another error message
</pre>

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

<pre>
<span style=color:#00B9FF>index.ts</span>:<span style=color:#FFE000>3</span>:<span style=color:#FFE000>7</span> - <span style=color:#FF0000>error</span>: Error Message

<span style=background-color:#F5F5F5;color:#000000>Custom mark</span> Another error message
</pre>
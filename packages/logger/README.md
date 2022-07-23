# Examples

## Logger

```ts
import { Logger } from "@infinite-fansub/logger"
```

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
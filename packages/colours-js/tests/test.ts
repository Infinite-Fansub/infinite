/*eslint-disable @typescript-eslint/naming-convention*/
import { c, Color, GradientPoint, AnsiCode } from "../src";

console.log(c`${AnsiCode.BOLD + Color.RED.asForeground + AnsiCode.UNDERLINED}Rational Approximations`);

for (let i = 0; i < 10; i++) {
    let r = Math.random();
    let lb_n = 0, lb_d = 1, ub_n = 1, ub_d = 1;
    let m_n = 1, m_d = 2;
    let m = m_n / m_d;
    while (Math.abs(r - m) > 1e-15) {
        if (r - m >= 0) {
            lb_n = m_n;
            lb_d = m_d;
        } else {
            ub_n = m_n;
            ub_d = m_d;
        }
        m_n = lb_n + ub_n;
        m_d = lb_d + ub_d;
        m = m_n / m_d;
    }
    // eslint-disable-next-line max-len
    console.log(c`${AnsiCode.BOLD}${new GradientPoint(Color.CYAN)}${r}${new GradientPoint(Color.WHITE)}${AnsiCode.NORMAL_INTENSITY + AnsiCode.ITALIC + AnsiCode.FG_RESET + Color.GREEN.asForeground} is closely approximated by ${AnsiCode.NOT_ITALIC + AnsiCode.BOLD}${new GradientPoint(Color.BLUE)}${AnsiCode.UNDERLINED}${m_n}${AnsiCode.NOT_UNDERLINED} / ${AnsiCode.UNDERLINED}${m_d}${new GradientPoint(Color.MAGENTA)}`);
}

// eslint-disable-next-line max-len
console.log(c`${new GradientPoint(Color.RED)}I ${AnsiCode.ITALIC}love${AnsiCode.NOT_ITALIC} ${AnsiCode.UNDERLINED}Bezier curves${AnsiCode.NOT_UNDERLINED}, they're such ${AnsiCode.BOLD}wonderful${AnsiCode.NORMAL_INTENSITY} and ${AnsiCode.BOLD}powerful${AnsiCode.NORMAL_INTENSITY} tools ${AnsiCode.BOLD}<3${AnsiCode.NORMAL_INTENSITY}${new GradientPoint(Color.BLUE, false, [Color.YELLOW, Color.GREEN])}`);
import fs from "fs";
import path from "path";
import handlebars from "handlebars";
import puppeteer, { PaperFormat } from "puppeteer";

export async function buildBufferPDF(templateFile: string, templateData: any, pdfPaperSize?: string, landscape = true) {
    // Register the 'eq' helper for comparison in Handlebars templates
    handlebars.registerHelper("eq", function (a, b) {
        return a == b;
    });

    // Define the path to the Handlebars template file
    const templatePath = path.join(__dirname, `../../templates/${templateFile}.hbs`);

    const template = fs.readFileSync(templatePath, "utf-8");
    const compiledTemplate = handlebars.compile(template);
    const renderedTemplate = compiledTemplate(templateData);

    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    const page = await browser.newPage();
    await page.setContent(renderedTemplate, { waitUntil: "networkidle0" });

    let paperSize: PaperFormat | undefined;
    if (pdfPaperSize === undefined) {
        paperSize = "A4";
    } else {
        paperSize = pdfPaperSize as PaperFormat;
    }

    const buffer = await page.pdf({
        format: paperSize,
        landscape,
        margin: {
            top: 16,
            bottom: 16,
            left: 16,
            right: 16,
        },
    });
    await browser.close();

    return buffer;
}

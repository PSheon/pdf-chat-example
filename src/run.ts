import { mastra } from "./mastra";

async function main() {
    const agent = mastra.getAgent('pdfAgent')

    let result = await agent.generate([
        {
            role: 'user',
            content: [
                {
                    type: 'file',
                    data: 'https://socrates.acadiau.ca/courses/engl/rcunningham/resources/Shpe/Hamlet.pdf',
                    mimeType: 'application/pdf'
                },
                {
                    type: 'text',
                    text: 'What is the name of the play?'
                }
            ]
        }
    ])

    console.log(result.text)

    result = await agent.generate([
        {
            role: 'user',
            content: [
                {
                    type: 'file',
                    data: 'https://socrates.acadiau.ca/courses/engl/rcunningham/resources/Shpe/Hamlet.pdf',
                    mimeType: 'application/pdf'
                },
                {
                    type: 'text',
                    text: 'Who is the villain of the play?'
                }
            ]
        }
    ])

    console.log(result.text)
}

main()

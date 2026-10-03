import { notion } from "../lib/notion.js"
import AppError from "#utils/appError.js"

class CaseStudiesService {
  constructor() {}

  mapCaseStudy(page) {
    const props = page.properties

    return {
      id: page.id,
      title: props.Title?.title?.[0]?.plain_text ?? "",
      description: props.Description?.rich_text?.[0]?.plain_text ?? "",
      link: props.Link?.url ?? null,
      cover: props["Cover          "]?.files?.[0]?.file?.url ?? null,
      published: props["Published      "]?.date?.start ?? null,
      order: props["Order          "]?.number ?? null,
    }
  }
    
  async getCaseStudies() {
    const databaseId = process.env.NOTION_DATA_SOURCE_ID

    const res = await notion.dataSources.query({
      data_source_id: databaseId,
    })

    return res.results.map(page => this.mapCaseStudy(page))
  }

  
}

export default CaseStudiesService


# **✍️ Quick notes**

## **AI Summit**

Jul 29, 2026  
[Michael Flynn](mailto:mike@powerclouderp.com) [Ron Shaw](mailto:ron@powerclouderp.com) [Justin Lombardi](mailto:justin@powerclouderp.com) [Imran Shabbir](mailto:imran@powerclouderp.com) [Taha Raja](mailto:taha@powerclouderp.com)

The team standardized project assessment processes, refined AI integration strategies, and solidified client communication protocols.

## **AI Workflow Standardization**

* Standardizing executive summary processes by shifting instructions into reusable, sharable skill files (.md) rather than a monolithic system file (Taha Raja).  
* Skills operate as modular, on-demand instructional sets that Claude invokes based on context.  
* Hooks implemented to trigger specific skills for language checking and quality assessment during document generation.  
* Focus on removing verbose, "flowery" AI terminology and M-dashes to maintain a professional, human-like writing voice.

## **Assessment Workflow and Deliverables**

* Rebuilt client assessment workflow to prioritize factual accuracy and eliminate narrative storytelling.  
* Adopted "artifacts" to generate presentable, sharable documentation for team review and collaboration.  
* Verification steps integrated internally, limiting client-facing reports to essential, high-impact data points.  
* Standardized procedures ensure consistency across deliverables, regardless of the individual consultant executing the process.

## **Strategic AI Tool Development**

* Exploring development of a custom tool to optimize model selection per sub-task, such as using high-tier models for intensive logic and lightweight models for drafting.  
* Integrating feedback loops to continuously update the knowledge base using insights from historical session data and recordings.  
* Researching efficient knowledge retrieval methods, such as hierarchical MD structures, to reduce token usage and improve information relevance.

## **Assessment Documentation and Formatting**

* Agreed to standardize assessment report structure: concise summary table at the start with hyperlinks to verbose details in an appendix (Michael, Taha).  
* Mandated removal of all adverbs and subjective opinions from reports to ensure objective, fact-based delivery.  
* Determined the executive summary must prioritize the business overview section at the document start.  
* Recognized need for a standardized, explicit process for AI to retrieve and embed client logos in assessments.

## **AI Knowledge Base Development**

* Proposed creating an AI-driven knowledge base from project history to replace manual lookup for common implementation tasks.  
* Identified necessity for a feedback loop to ingest NetSuite release notes and proactively update outdated workarounds in the documentation.  
* Flagged the limitation of raw Oracle database ingestion; prioritized directed AI training over indexing entire external help centers.

## **Project Classification and Client Management**

* Distinguished between 'Rapid Assessment' (typically rescue missions) and 'Implementation' (new installs) to ensure consistent project terminology.  
* Discussed necessity of tracking client-specific feature usage to proactively identify impact when software (e.g., Shopify API) changes occur.

## **Long-term Tooling Vision**

* Explored evolving internal AI documentation tools into a structured, client-facing AI-powered project management portal.  
* Advocated for shifting data management from static documents to an underlying database to improve AI memory and structural consistency.

## **AI Data Integration and Processing**

* Concerns regarding data silos when storing documents in Drive versus databases (Michael Flynn).  
* Gemini and similar AI models utilize workspace indexes, acting effectively as databases on the backend.  
* Open debate regarding the efficacy of unstructured (markdown) versus structured data for AI crawlability.

## **Reporting Accuracy and AI Verification**

* Identified issues where reports omitted key topics like Shopify order flow and payout mismatches.  
* Proposed utilizing Evidence MD files as a formal cross-reference document for quality assurance.  
* Conference room recordings attribute all comments to the user who logged in, complicating speaker identification.

## **File Management and Workflow Automation**

* Data corruption issues observed when copying Google Docs using Windows Explorer; documents truncated.  
* Proposed using Google App Scripts to automate moving meeting recordings into project-specific folders (Michael Flynn).  
* Automation scripts require strict adherence to meeting title naming conventions to function correctly (Taha Raja).

## **Report Formatting and Executive Feedback**

* Customer feedback indicates overly dense reports are difficult to digest; described as "drinking from a firehose."  
* Recommended moving summary tables to the report beginning to increase readability and target specific workstreams (Taha Raja).  
* Advised against repeating known business overview information; focus instead on current state and recommended actions.

## **AI-Agent Workflow and File Structure**

* Decided to leverage existing folder structures for AI agents without requiring immediate reorganization.  
* Confirmed AI agents cannot consume raw video or audio and must rely on transcript-based context.  
* Established requirement for standardized boilerplate text for billing and rates in AI context files.

## **Project Management and Tooling Vision**

* Proposed centralized 'onboarding' app to automate folder creation, task workflows, and project initialization.  
* Goal to replicate essential task management features while maintaining core Google infrastructure.  
* Strategy to prioritize simplified, internal tool building over adopting complex, external PM suites.

## **Billing and Administrative Communication**

* Advised adopting a factual, non-apologetic stance regarding billable project rework to maintain professional leverage.  
* Confirmed all project rework must be clearly identified and approved as billable time.  
* Prioritizing succinct, direct communication to maximize time efficiency and reduce ambiguity.

## **Workspace and Operational Strategy**

* Explored flexible office space, including warehouse flex-space models, for potential operational hubs.  
* Acknowledged viability of multi-tenant or shared-use garage concepts for cost-effective team workspaces.

## **Implementation Strategy and Rapid Assessments**

* Shinasty approved the rapid assessment and requested to proceed with implementation tasks.  
* Distinguished between new implementations and existing accounts regarding appropriate AI-assisted workflows.  
* Prioritized guiding customer decision-making over automated task execution for high-value consultancy.

## **AI and Automation Capabilities**

* Identified potential for AI to automate cleanup tasks, such as identifying unused scripts, fields, and entity records.  
* Proposed developing a library of common tasks (e.g., supply allocation, workflow generation) to leverage AI efficiency.  
* Noted AI limitations in retrieving specific NetSuite APM performance data, requiring manual screenshots for analysis.

## **Development and Deployment Standards**

* Expressed preference for using scripts over workflows due to greater flexibility and efficiency.  
* Suggested using custom records for configuration settings to provide user-friendly inputs without compromising performance.  
* Acknowledged critical constraints, including lack of sandbox access and a read-only MCP role.

## **44 Pro Project Dispute and Resolution**

* Ongoing billing conflict regarding Amazon channel integrations addressed through historical review.  
* Data analysis confirms Amazon stores for Canada, Mexico, and Brazil existed during implementation but lacked significant activity and were not part of original configuration scope.  
* Customer UAT identified as insufficient, failing to flag configuration gaps for 6 months.  
* Proposed 20-30 hours of future credit to resolve invoice disputes and prioritize long-term client retention.

## **AI Implementation Strategy and Workflow**

* Shifted focus to 'actionable' project execution by combining AI-assisted brainstorming with consultant oversight.  
* Established human-in-the-loop workflow: AI generates use cases and plans, while consultants validate and execute system configurations.  
* Mandated manual verification for all AI-generated scripts and code to mitigate risk to customer systems.  
* Automation strategy includes pushing task creation to Asana and utilizing AI to identify necessary work sessions.

## **Meeting Logistics**

* Meeting room remains available for team use until 5 PM.

## **Next steps**

- [ ] \[Taha Raja\] Recreate summary: Recreate the meeting summary.  
- [ ] \[Michael Flynn\] Create detailed summary: Generate a full transcription and a detailed summary, then compile it into a Word document.  
- [ ] \[Taha Raja\] Share MCP document: Share the document regarding the Machine Context Protocol and plugins.  
- [ ] \[The group\] Research artifacts: Research Claude artifacts to evaluate their utility and suitability for document management and sharing.  
- [ ] \[Michael Flynn, Imran Shabbir, Taha Raja\] Draft AI Requirements: Draft a document for the AI engineer summarizing the key topics and current knowledge base to serve as a starting point for tool development.  
- [ ] \[The group\] Maintain Customer Feature Knowledge Base: Create a list of all features and functions currently used by each client to support proactive impact assessment.  
- [ ] \[The group\] Remove Subjective Language: Refine the assessment document by removing adverbs and opinionated language to ensure objective reporting.  
- [ ] \[The group\] Reorder Executive Summary: Move the business overview section to the start of the executive summary in the assessment document.  
- [ ] \[The group\] Update Assessment Template: Update the assessment template to feature a summary table at the beginning with links to verbose details located in the appendix.  
- [ ] \[The group\] Standardize Logo Retrieval: Establish a consistent and explicit process for the AI to retrieve and include client logos in assessment documents.  
- [ ] \[Taha Raja\] Query Claude: Request Claude to refer to source transcripts and explain why specific topics were omitted from the report.  
- [ ] \[Taha Raja\] Replace Document: Replace the corrupted project document to ensure the AI accesses the full text rather than a truncated version.  
- [ ] \[The group\] Automate File Management: Develop a Google App Script to automatically move new meeting recordings into the designated project folders.  
- [ ] \[Michael Flynn\] Update Cloud MD File: Update the cloud MD file to specify that the existing folder structure will also be used for ongoing project work.  
- [ ] \[Taha Raja\] Check 44 Copy: Verify if a copy of the 44 transcript file has been created.  
- [ ] \[Michael Flynn\] Investigate File Organization: Investigate the requirements and potential impact of moving existing project files into a standardized source subfolder structure.  
- [ ] \[Michael Flynn\] Generate SDF Content: Process existing documents with Claude to produce SDF information for the next session.  
- [ ] \[Michael Flynn\] Send Asana Ticket: Draft and send an Asana supplement ticket regarding project rework and invoicing. Request explicit approval on the ticket before beginning work.  
- [ ] \[Imran Shabbir\] Discuss Rework: Address the rework and billing issue during the upcoming executive call. Explain that the work is billable as project work.  
- [ ] \[Michael Flynn\] Order Lunch: Provide the link for the group lunch order. Ensure all participants can order their preferred meals.  
- [ ] \[Taha Raja\] Kickoff Project: Initiate the setup for the 44 Pro project. Proceed with the Shinasty rapid assessment in parallel.  
- [ ] \[Michael Flynn\] Schedule Foundry Meeting: Arrange a meeting with Satchin for the Foundry project. Coordinate the timeline to keep tasks moving forward.  
- [ ] \[Michael Flynn\] Remove Old Notes: Delete the existing 44 Pro summary document to prevent confusion from outdated comments.  
- [ ] \[Michael Flynn\] Review Invoice: Investigate and resolve discrepancies in time logs and comment entries on the invoice to clear overlapping data.  
- [ ] \[44 Pro\] Draft Response: Create a response to the customer regarding the provided invoices and email thread.  
- [ ] \[Michael Flynn\] Update Rod: Send a reply to Rod mentioning the proactive management of the process.  
- [ ] \[44 Pro\] Document Conversations: Write a detailed explanation in support of specific conversations held during past meetings.  
- [ ] \[44 Pro\] Review Amazon Data: Investigate order history and configuration information to determine the establishment date for specific store channels.  
- [ ] \[Michael Flynn\] Share Discount Details: Provide information regarding the discount conversation to Stefan.  
- [ ] \[Michael Flynn\] Book Simulator: Locate and distribute the registration link for the baseball simulator venue.  
- [ ] \[Michael Flynn\] Propose Credit: Initiate a discussion to offer partial credit to resolve project concerns.

**Want to see more?** [View the full notes]()  
Tip: You can always access your full notes from the left sidebar.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*  
*How is the quality of **these specific notes?** [Take a short survey](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?confid=iRUAwyJhe5GFBnhxDZ-mDxIROAIIigIgABgBCA&entryPoint=footerQuickNotes&isGoogler=False) to let us know your feedback, including how helpful the notes were for your needs.*

# **📝 Full notes**

Jul 29, 2026

## **AI Summit**

Invited [Michael Flynn](mailto:mike@powerclouderp.com) [Ron Shaw](mailto:ron@powerclouderp.com) [Justin Lombardi](mailto:justin@powerclouderp.com) [Imran Shabbir](mailto:imran@powerclouderp.com) [Taha Raja](mailto:taha@powerclouderp.com)

Attachments [AI Summit](https://calendar.google.com/calendar/event?eid=NDRpN2VuNm5nY2k0N2NqaGFuZGJpcGhkZnJfMjAyNjA3MjlUMTIwMDAwWiB0YWhhQHBvd2VyY2xvdWRlcnAuY29t)

Meeting records [Transcript](https://docs.google.com/document/d/1dHBgy-_3Yp5iza1-CcfibjHqo7_O33cbOK81-h2nP1E/edit?usp=drive_web&tab=t.ll35grpecs4j) [Recording](https://drive.google.com/file/d/1QA5Nywuw2U6_P7PY4q5e9GE_QVUdGYE7/view?usp=drive_web) 

### **Summary**

The team standardized project assessment processes, refined AI integration strategies, and solidified client communication protocols.

**Standardizing AI Summary Processes**  
The team initiated a plan to standardize executive summary processes using a consistent framework to improve consistency. They prioritized AI personalization to ensure outputs match individual writing styles rather than using generic language.

**Refining Client Documentation Standards**  
The team finalized a strategy for client documentation, favoring a tabular format at the front followed by detailed evidence. They agreed to exclude irrelevant financial information and focus on professional, objective language.

**Resolving Project Scope Issues**  
To resolve scope disputes on a current project, the team decided to offer future credit for additional work to preserve the client relationship. They also prioritized building a structured, database-driven project management tool.

### **Decisions**

## Aligned

* **AI writing style standards established** The team will adopt a writing standard for AI outputs that eliminates flowery, verbose language and removes m-dashes to ensure content sounds professional and authentic.

* **Autonomous AI behavior fine-tuning postponed** The team will postpone fine-tuning the autonomous behaviors of AI agents until the new AI developer is onboarded to manage the technical configuration.

* **Two distinct project paths established** The team will establish two distinct procedural paths for project engagements, separating rapid assessments from new implementations.

* **Release notes integration into feedback loop** New software release notes will be loaded into the AI feedback loop to proactively update and refine knowledge base instructions.

* **SaaS business model exclusion** The company will exclude recurring revenue SaaS business models from their service focus.

* **Markdown prioritized for drafting and editing** All drafts will be generated and edited in Markdown format before rendering the final polished document.

* **Removal of subjective language in reports** Client-facing reports must strictly exclude adverbs and subjective or judgmental language to ensure objectivity.

* **Standardized report document structure** Client-facing reports will follow a standardized format featuring a concise summary table at the front, followed by a verbose section or appendix for detailed explanations.

* **Adoption of numbered narrative style** The team will adopt the numbered narrative style for documentation to improve ease of reader digestion.

* **Standardization of meeting recording storage** All meeting recordings must be stored within the designated project folder for each client to improve data organization and retrieval.

* **Implementation of evidence file process** The team will adopt the use of a detailed 'evidence file' as a required component of the documentation process.

* **Restructuring report document layout** Reports will be reorganized to position the summary table at the top, followed by work stream sections, relegating verbose details to the end of the document.

* **Project folder structure retained** The existing assessment and project folder structure is retained for all projects without the need for reorganization.

* **Ongoing project instructions policy** New standardized instruction sets for ongoing projects are deemed unnecessary, as direct folder access provides sufficient context for AI operations.

* **Standardized billing boilerplate implementation** Boilerplate billing clauses for specific customer types will be incorporated into the project context files for the AI.

* **Protocol for billable rework requests** All billable rework requires a formal Asana ticket submission and explicit customer approval prior to the commencement of work.

* **Scripting preferred over workflows for implementation** Scripting is preferred over workflow creation for implementation tasks unless the customer requires future UI-based modification capabilities.

* **Read-only access constraint for engagements** Engagement activities via MCP are limited to read-only access due to current sandbox and role constraints.

* **Targeted script reading policy adopted** AI script review requests will be restricted to specific tasks relevant to the project scope to avoid unnecessary full-system analysis.

* **Human-in-the-loop AI execution policy** The team established a requirement for human oversight in all AI-driven planning and execution processes to prevent errors and ensure strategic control of customer systems.

* **Client concession approved for 44 Pro** The team approved offering a future credit concession to the 44 Pro client, prioritizing long-term customer relationship preservation over disputing project scope.

We've **updated the Decisions section** using your feedback.

Let us know what you think: [Helpful](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?isHelpful=True&entryPoint=decisions&confid=iRUAwyJhe5GFBnhxDZ-mDxIROAIIigIgABgBCA&isGoogler=False) or [Not Helpful](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?isHelpful=False&entryPoint=decisions&confid=iRUAwyJhe5GFBnhxDZ-mDxIROAIIigIgABgBCA&isGoogler=False)

### **Next steps**

- [ ] \[Taha Raja\] Recreate summary: Recreate the meeting summary.

- [ ] \[Michael Flynn\] Create detailed summary: Generate a full transcription and a detailed summary, then compile it into a Word document.

- [ ] \[Taha Raja\] Share MCP document: Share the document regarding the Machine Context Protocol and plugins.

- [ ] \[The group\] Research artifacts: Research Claude artifacts to evaluate their utility and suitability for document management and sharing.

- [ ] \[Michael Flynn, Imran Shabbir, Taha Raja\] Draft AI Requirements: Draft a document for the AI engineer summarizing the key topics and current knowledge base to serve as a starting point for tool development.

- [ ] \[The group\] Maintain Customer Feature Knowledge Base: Create a list of all features and functions currently used by each client to support proactive impact assessment.

- [ ] \[The group\] Remove Subjective Language: Refine the assessment document by removing adverbs and opinionated language to ensure objective reporting.

- [ ] \[The group\] Reorder Executive Summary: Move the business overview section to the start of the executive summary in the assessment document.

- [ ] \[The group\] Update Assessment Template: Update the assessment template to feature a summary table at the beginning with links to verbose details located in the appendix.

- [ ] \[The group\] Standardize Logo Retrieval: Establish a consistent and explicit process for the AI to retrieve and include client logos in assessment documents.

- [ ] \[Taha Raja\] Query Claude: Request Claude to refer to source transcripts and explain why specific topics were omitted from the report.

- [ ] \[Taha Raja\] Replace Document: Replace the corrupted project document to ensure the AI accesses the full text rather than a truncated version.

- [ ] \[The group\] Automate File Management: Develop a Google App Script to automatically move new meeting recordings into the designated project folders.

- [ ] \[Michael Flynn\] Update Cloud MD File: Update the cloud MD file to specify that the existing folder structure will also be used for ongoing project work.

- [ ] \[Taha Raja\] Check 44 Copy: Verify if a copy of the 44 transcript file has been created.

- [ ] \[Michael Flynn\] Investigate File Organization: Investigate the requirements and potential impact of moving existing project files into a standardized source subfolder structure.

- [ ] \[Michael Flynn\] Generate SDF Content: Process existing documents with Claude to produce SDF information for the next session.

- [ ] \[Michael Flynn\] Send Asana Ticket: Draft and send an Asana supplement ticket regarding project rework and invoicing. Request explicit approval on the ticket before beginning work.

- [ ] \[Imran Shabbir\] Discuss Rework: Address the rework and billing issue during the upcoming executive call. Explain that the work is billable as project work.

- [ ] \[Michael Flynn\] Order Lunch: Provide the link for the group lunch order. Ensure all participants can order their preferred meals.

- [ ] \[Taha Raja\] Kickoff Project: Initiate the setup for the 44 Pro project. Proceed with the Shinasty rapid assessment in parallel.

- [ ] \[Michael Flynn\] Schedule Foundry Meeting: Arrange a meeting with Satchin for the Foundry project. Coordinate the timeline to keep tasks moving forward.

- [ ] \[Michael Flynn\] Remove Old Notes: Delete the existing 44 Pro summary document to prevent confusion from outdated comments.

- [ ] \[Michael Flynn\] Review Invoice: Investigate and resolve discrepancies in time logs and comment entries on the invoice to clear overlapping data.

- [ ] \[44 Pro\] Draft Response: Create a response to the customer regarding the provided invoices and email thread.

- [ ] \[Michael Flynn\] Update Rod: Send a reply to Rod mentioning the proactive management of the process.

- [ ] \[44 Pro\] Document Conversations: Write a detailed explanation in support of specific conversations held during past meetings.

- [ ] \[44 Pro\] Review Amazon Data: Investigate order history and configuration information to determine the establishment date for specific store channels.

- [ ] \[Michael Flynn\] Share Discount Details: Provide information regarding the discount conversation to Stefan.

- [ ] \[Michael Flynn\] Book Simulator: Locate and distribute the registration link for the baseball simulator venue.

- [ ] \[Michael Flynn\] Propose Credit: Initiate a discussion to offer partial credit to resolve project concerns.

### **Details**

* **Transcript and Recording Management**: Taha Raja and Michael Flynn discussed technical issues regarding a short, 22-second transcript and the need to re-generate summaries using AI tools ([00:02:03](#00:02:03)). They confirmed that the original meeting recording lasted one hour and five minutes and planned to use Claude to generate a full transcription and a detailed summary with next-step action items ([00:03:22](#00:03:22)).

* **Executive Summary Process Standardization**: Taha Raja and Michael Flynn initiated a plan to standardize the executive summary process, requiring all team members to use a consistent framework for their project assessments ([00:05:26](#00:05:26)). Taha Raja noted that this process is being enforced across the team to improve consistency and leverage their specific process skills ([00:08:38](#00:08:38)).

* **Understanding and Implementing AI Skills**: The participants discussed the concept of "skills" within Claude, which consist of sets of instructions and knowledge that allow the AI to retain processes and context, effectively preventing the "blank slate" problem associated with starting new sessions. These skills can be shared within the team, downloaded from marketplaces, and used explicitly or implicitly to guide the AI's behavior ([00:09:20](#00:09:20)).

* **Personalizing AI Voice**: Taha Raja highlighted the importance of training AI on personal documents, such as emails and local files, so that generated content reflects the individual’s unique writing style rather than generic, computer-generated language ([00:12:34](#00:12:34)). The team agreed that this personalization is critical for maintaining professional relationships and ensuring that recipients feel they are communicating with a real person ([00:13:37](#00:13:37)).

* **Maintaining Writing Standards and Human Oversight**: The team discussed the necessity of human proofreading to remove verbose, flowery language, "M dashes," and AI-hallucinated content, such as the example of a professor catching AI-generated essays by hiding a nonsensical sentence in the text. They emphasized that while AI assists with generation, the final output must be verified to ensure it is accurate and authentic to the sender’s voice ([00:13:37](#00:13:37)) ([00:16:30](#00:16:30)).

* **Architecture of AI Tooling**: The discussion covered the technical architecture of their AI usage, distinguishing between the \`cloud.md\` file (which contains rules applied to every session), skills (called on demand), and hooks (which trigger specific skills during tasks). They also noted that Model Context Protocol (MCP) acts as an API for AI to access data ([00:19:21](#00:19:21)).

* **Refined Rapid Assessment Workflow**: The team worked on refining their rapid assessment workflow by moving source documentation into a "redo" folder and configuring the AI to use existing project prompts ([00:23:30](#00:23:30)). Imran Shabbir noted that this approach creates a repeatable process, ensuring that assessments are consistent regardless of who runs them ([00:26:47](#00:26:47)).

* **Strategic Model Selection and Custom Tooling**: Participants explored the need for more intelligent model selection when spawning sub-agents, suggesting that simple tasks should use standard models while more intensive work requires higher-capability models ([00:27:42](#00:27:42)). Taha Raja suggested that building their own custom tools would allow them to specify which models to use for different sub-tasks, avoiding the limitations of using a standard interface ([00:28:51](#00:28:51)).

* **Utilizing Artifacts for Deliverables**: The team experimented with the "artifacts" feature in Claude, which creates shareable, professional-looking document representations of the work process ([00:32:15](#00:32:15)) ([00:38:03](#00:38:03)). They discussed using these artifacts to break down changes made to their processes and share them effectively with the wider team ([00:33:05](#00:33:05)) ([00:38:03](#00:38:03)).

* **NetSuite Playbook and Knowledge Base Management**: The team reviewed their NetSuite playbook MD file, debating whether it should function as a general knowledge base or remain client-specific ([00:45:04](#00:45:04)) ([00:51:31](#00:51:31)). They expressed concerns regarding the manual maintenance required to keep the knowledge base current and discussed strategies for making the AI's referencing of this data more efficient to reduce token usage ([00:48:37](#00:48:37)).

* **AI Engineer Candidate Interview**: Taha Raja and Michael Flynn discussed a recent interview with an AI engineer candidate based in India. They noted that the candidate was transparent about using AI in their workflows and was able to explain the design clearly, standing out from other applicants who were less knowledgeable about the AI outputs they presented ([00:50:36](#00:50:36)).

* **Long-term Vision for Knowledge Management**: The participants concluded with a vision to create a searchable library of scripts and processes, aiming to prevent redundant work and "reinventing the wheel" ([00:56:35](#00:56:35)). They planned to develop a feedback loop that parses session recordings and chats into a structured knowledge base, allowing the AI to automatically suggest solutions or past practices when similar problems arise in future engagements ([00:55:38](#00:55:38)) ([00:57:30](#00:57:30)).

* **Standardizing Client-Facing Documentation**: The team discussed the need for a consistent voice and tone in all client-facing documents and decks, emphasizing the importance of brevity and avoiding unnecessary pleasantries ([00:59:26](#00:59:26)). They decided to use markdown files to ensure that instructions are easily editable without requiring coding knowledge, citing a specific previous assessment as an exemplar of the desired quality ([01:00:36](#01:00:36)).

* **Internal vs. External Information**: Participants agreed to keep internal verifications separate from the external document to reduce noise, while still maintaining the ability to capture necessary context. They discussed whether to use specific examples or more generic instructions for AI to follow, with a consensus to utilize a collection of past assessments to generate the best output ([01:01:39](#01:01:39)).

* **Distinguishing Engagement Types**: The team distinguished between "rescue" missions and "new implementations," noting that these require different approaches, questions, and timelines ([01:03:09](#01:03:09)). There was a discussion regarding standardization, with the team aiming to standardize the implementation process while acknowledging that every project possesses unique characteristics ([01:05:06](#01:05:06)).

* **Scope of Assessment Reports**: The group agreed to exclude budget and billing hour information from the final report, as these are irrelevant to the assessment's objective ([01:07:16](#01:07:16)). They also touched upon the necessity of providing accurate context for AI, specifically regarding "fundamental truths" like using customer deposits in e-commerce integrations, which requires both business logic and system knowledge ([01:08:55](#01:08:55)).

* **Technical Process Logic**: Michael Flynn and Imran Shabbir debated the technical specifics of e-commerce integrations, specifically regarding authorization and capture timing ([01:10:10](#01:10:10)). They agreed that the "why" behind these configurations—which often differs from standard NetSuite documentation—should be documented in a central playbook rather than relying solely on product documentation ([01:12:22](#01:12:22)).

* **Knowledge Base Maintenance**: The team discussed building a knowledge base derived from past projects, acknowledging that such databases can become filled with irrelevant or outdated information ([01:14:23](#01:14:23)). They explored the necessity of a feedback loop to update workarounds—such as previously necessary manual vendor prepayment processes—that are now obsolete due to system updates ([01:15:17](#01:15:17)).

* **Leveraging AI and Release Documentation**: Regarding the maintenance of technical information, the participants suggested that rather than crawling the entire Oracle documentation, they should use a more directed approach ([01:16:02](#01:16:02)). They proposed a system where new release notes are fed into an AI feedback loop, allowing the process to identify if existing workflows need adjustment without manual intervention ([01:17:46](#01:17:46)).

* **Exclusions and Customer-Specific Tracking**: The team decided to exclude software sales and recurring revenue SaaS model discussions from their reports as they fall outside their current expertise ([01:20:27](#01:20:27)). Additionally, they discussed the value of tracking which features and configurations each specific customer uses to proactively manage the impact of software changes and API updates ([01:21:24](#01:21:24)).

* **Drafting and Review Workflow**: The group defined a two-step drafting workflow: first generating markdown files for review and refinement, then producing the final polished document ([01:22:29](#01:22:29)). They agreed that this approach allows for easier adjustments to content, such as Level of Effort estimates, before the final formatting is applied ([01:23:34](#01:23:34)).

* **Execution Planning**: The team discussed the inclusion of execution plans in their deliverables, noting that while they could theoretically execute plans directly, they should maintain a separation between the assessment phase and the execution of Software Development Framework components ([01:25:28](#01:25:28)). They confirmed that the current process of writing in markdown before generating the final document is efficient and effective ([01:26:30](#01:26:30)).

* **Document Content and Tone**: Participants reviewed a draft and identified areas for improvement, specifically noting the need to remove adverbs, judgmental language, and subjective opinions to ensure an objective, professional tone ([01:28:40](#01:28:40)). They also emphasized that the "Business Overview" section should be the starting point of the document, rather than burying it under summary points ([01:30:40](#01:30:40)).

* **Refining Summary Points**: The team reviewed key standing items, such as the customer deposit and order process flow, noting that if the AI fails to surface these in the summary, they need to trace the discussion back to the transcript to improve the prompt logic ([01:31:28](#01:31:28)). They also discussed ensuring that facts cited in the report are clearly verified ([01:33:19](#01:33:19)).

* **Professionalism in Deliverables**: The participants criticized the use of conversational, overly informal, or "salesy" language in the report, agreeing that document content should be direct and factual ([01:34:32](#01:34:32)). They re-emphasized the importance of capturing the correct technical issues—such as Shopify integration and order processing—and identifying if the AI is successfully picking them up ([01:35:21](#01:35:21)).

* **Discounting and Promotion Logic**: The team discussed the complexities of discount and promotion logic in NetSuite, debating whether to use native "SuitePromotions" versus custom scripts ([01:37:48](#01:37:48)). They analyzed specific scenarios where custom scripts previously conflicted and agreed on the necessity of auditing whether native functionality can replace these custom solutions to simplify the environment ([01:38:49](#01:38:49)).

* **Revenue Recognition and Reporting**: There was an extended discussion regarding the accounting implications of applying discounts and price levels ([01:40:56](#01:40:56)). The participants agreed that inflating top-line revenue reporting by incorrectly applying discounts or misusing contra-income accounts is inappropriate and potentially illegal, emphasizing the need for accurate revenue posting ([01:42:40](#01:42:40)).

* **Visual Branding and Formatting**: The team noted that the AI-generated document included logos effectively but agreed to be more explicit in their future prompts to ensure branding consistency ([01:44:26](#01:44:26)). They expressed satisfaction with the current document layout, which provides clear separation between tasks ([01:45:34](#01:45:34)).

* **Structural Preferences**: The group debated the best way to present information, favoring a tabular format at the front of the document for quick digestion, with a verbose section acting as an appendix for detailed explanations ([01:46:59](#01:46:59)). They agreed that linking the table directly to the appendix section is the optimal user experience for clients ([01:47:56](#01:47:56)) ([01:49:52](#01:49:52)).

* **Client Communication Strategy**: The participants concluded that while client preferences may vary, the tabular-first approach with detailed supporting text is the best standard, as it caters to different levels of engagement ([01:50:51](#01:50:51)). They noted that this structure is also beneficial for maintaining a consistent deliverable, even if the primary interaction eventually shifts to a presentation-based format ([01:52:44](#01:52:44)).

* **Long-term Vision and AI Integration**: The team discussed the future state of their process, envisioning a transition from static documents to a structured database-driven model where the application serves as an AI-powered project management tool ([01:53:43](#01:53:43)). They agreed that regardless of the specific AI model used, building a system that allows for model portability and deep workspace indexing is the correct strategic direction ([01:55:36](#01:55:36)).

* **Data Architecture and Silos**: Michael Flynn and Taha Raja discussed the inefficiency of maintaining data across silos like Google Drive and separate databases. They debated whether to build a new, dedicated database or leverage existing Google Workspace indexes via AI, with Michael Flynn noting that manual data organization by humans is prone to chaos and that using existing infrastructure is more effective ([01:57:39](#01:57:39)).

* **AI Data Handling Debate**: Taha Raja and Michael Flynn explored whether AI performs better with structured databases or unstructured formats like markdown and flat text. They noted this remains an open debate, though Taha Raja expressed concern that using flat files for long-term task logging and updates could become unmanageable for human users ([01:59:25](#01:59:25)).

* **Incident Updates and AI Retrieval**: Imran Shabbir provided an update on a "burned items" incident, noting that findings may render ozone treatment unnecessary ([02:01:11](#02:01:11)). Concurrently, the team addressed failures in AI-generated reports to retrieve specific topics, with Taha Raja and Michael Flynn discussing the need to verify sources and prompt the AI to explain why specific information was excluded ([02:02:22](#02:02:22)).

* **Troubleshooting AI Analysis**: Taha Raja and Michael Flynn analyzed why an AI report missed critical details regarding Shopify order flow, concluding that the AI underweighted the topic because it appeared in only one sentence of the transcript ([02:04:14](#02:04:14)) ([02:09:32](#02:09:32)). They discussed the necessity of human verification and considered whether providing video or audio data could provide better context for the AI, despite potential costs associated with tokenization ([02:07:27](#02:07:27)) ([02:10:51](#02:10:51)).

* **Google Drive and Document Management**: The participants identified technical issues arising from copying and moving Google Docs, noting that copying link-based files in Windows Explorer creates "sub-document" issues rather than single, unified files ([02:12:01](#02:12:01)) ([02:15:01](#02:15:01)). Michael Flynn clarified that Google Docs are not standard files, and that moving them requires specific actions to avoid data corruption ([02:15:59](#02:15:59)).

* **Automating Recording Organization**: Taha Raja and Michael Flynn discussed the need to standardize the storage of meeting recordings by automatically moving them into specific project folders ([02:17:50](#02:17:50)). They explored using scripts and naming conventions to ensure recordings land in the correct folders, though Michael Flynn noted that manual intervention may sometimes be required when meeting titles are inconsistent ([02:19:37](#02:19:37)).

* **AI Output Quality and Metrics**: The group agreed that aiming for 100% accuracy is impractical and settled on an "80/20" approach, utilizing an "evidence" file as a starting point ([02:23:17](#02:23:17)). They briefly reviewed the extracted business data, confirming the accuracy of specific figures, including $43 million in revenue and various e-commerce metrics ([02:26:22](#02:26:22)).

* **Cultural Observations and Societal Norms**: Michael Flynn and Taha Raja engaged in a discussion comparing societal structures, cleanliness, and cultural assimilation in countries like Japan, Singapore, and France ([02:28:50](#02:28:50)) ([02:35:26](#02:35:26)). They reflected on how strict cultural norms and homogeneity can influence social order and public perception, occasionally relating these observations back to the importance of structured processes ([02:29:52](#02:29:52)) ([02:33:19](#02:33:19)).

* **Report Structure Refinement**: Taha Raja and Michael Flynn debated the necessity of the "Business Overview" and "Executive Summary" sections of their reports, agreeing that they should be concise since clients are already familiar with their own business ([02:37:34](#02:37:34)) ([02:40:09](#02:40:09)). They proposed merging these sections to eliminate verbosity and ensure the focus remains on "brass tacks" ([02:39:18](#02:39:18)) ([02:41:05](#02:41:05)).

* **Addressing the "Fire Hose" Effect**: Reflecting on a previous client presentation where participants felt overwhelmed by excessive information, Taha Raja and Michael Flynn discussed the need to reorganize reports to avoid overwhelming stakeholders ([02:43:01](#02:43:01)) ([02:48:38](#02:48:38)). They agreed to place the summary table at the front of the document and structure it by workstream, allowing different departments to focus on relevant information without reading the entire document ([02:43:57](#02:43:57)) ([02:49:34](#02:49:34)).

* **Standardizing Documentation**: The group finalized a strategy to standardize future documents by prioritizing the summary table, followed by brief issue descriptions and estimated hours, with links to detailed evidence ([02:49:34](#02:49:34)) ([02:51:22](#02:51:22)). Michael Flynn concluded that this structure effectively serves different audiences, providing high-level views for stakeholders while keeping granular technical details in the appendix ([02:44:58](#02:44:58)) ([02:51:22](#02:51:22)).

* **Future of AI Prompting and Interfaces**: Taha Raja suggests moving toward a user interface that handles prompting in the backend, allowing users to simply answer questions rather than manually constructing prompts. Michael Flynn agrees with this vision, emphasizing the need for a collaborative work stream for new projects that integrates recorded calls and documents into an automated backend process ([02:55:38](#02:55:38)).

* **Standardizing Project Folder Structures**: Michael Flynn and Taha Raja discuss implementing a standardized "Assessments" folder structure to organize new projects. They reach a consensus to reorganize existing folders under this new structure to ensure consistency while maintaining the ability for the AI to cross-pollinate data between assessment and traditional project folders ([02:56:44](#02:56:44)).

* **Accessing Ongoing Project Data**: For ongoing projects, Taha Raja and Michael Flynn conclude that creating complex new instruction sets is unnecessary. They determine that pointing the AI to existing customer folders and relying on current prompts is sufficient to execute tasks effectively ([03:00:23](#03:00:23)).

* **Organization of Source Documents**: Imran Shabbir, Michael Flynn, and Taha Raja discuss the need to organize project files into specific subfolders, such as "source" and "deliverables." Taha Raja agrees to take the lead on managing these folder reorganizations using AI to assist with file sorting ([03:02:22](#03:02:22)).

* **Standardizing Billing Language**: Michael Flynn and Taha Raja identify a need for standardized boilerplate text regarding billing and rates. They agree to create templates for different client types, such as Anderson Frank versus direct customers, to be used in AI instruction sets ([03:04:21](#03:04:21)).

* **Limitations of Current AI Tooling**: Michael Flynn clarifies that the current AI setup cannot directly consume video or audio files. As a result, the team must continue to rely on transcripts for AI data processing ([03:05:43](#03:05:43)).

* **Vision for a Project Management Application**: The group discusses developing a custom "onboarding" or project management tool. They envision an interface that automates folder setup, generates tasks, and provides a chat feature for interaction, while ensuring privacy to prevent customers from consuming excessive tokens .

* **Project Management Functional Scope**: Michael Flynn and Taha Raja define the functional scope for their potential project management tool. They determine it should handle task management, executive summaries, and status tracking, effectively replacing their current reliance on external platforms like Asana ([03:11:59](#03:11:59)).

* **Reviewing 44 Pro Project Data**: The team reviews the status of the "44 Pro" project files. Taha Raja and Michael Flynn discuss moving files into a proper "source" subfolder to ensure the AI can effectively parse the documents for the next phase of the project .

* **Managing Project Rework and Billing**: Taha Raja and Michael Flynn discuss the importance of explicitly communicating that project rework is billable. They agree to handle such requests by issuing an Asana ticket that requires formal client approval before any work commences, emphasizing the need to be direct and non-apologetic about billing .

* **Office and Flexible Workspace Concepts**: The group discusses various concepts for flexible workspaces, including "flex space" warehouses and garage rentals. They note the potential utility of these spaces for managing operations or storage and reflect on the trends of repurposing properties for business and recreational use .

* **Implementation Planning for Project 44**: Michael Flynn and Taha Raja plan to have the AI propose an action plan for project 44\. They agree to proceed with this task in parallel with other objectives .

* **Lunch Coordination**: The group coordinates a group lunch order from Jersey Mike's, discussing order logistics and menu preferences while managing their upcoming schedule .

* **New Hire and Foundry Scheduling**: Michael Flynn notes that a new employee is scheduled to start around August 18th. The group also discusses the need to schedule a meeting with Satchin regarding the Foundry project .

* **Professional Communication Standards**: Imran Shabbir and Michael Flynn discuss the importance of succinct communication with clients. They agree that complex technical information should be synthesized clearly to save time and prevent unnecessary documentation length ([03:48:21](#03:48:21)).

* **Status of RM Client**: Michael Flynn confirms that the RM client is out of contract and that all associated meetings have been canceled ([03:50:54](#03:50:54)).

* **Technical Environment and Task Rescoping**: Michael Flynn and Imran Shabbir discussed difficulties in connecting to the production environment. They reviewed the project plan for Shinasty, specifically focusing on the 5.1 e-commerce customer deposit implementation in Shopify, and noted that the process had not yet created a customer deposit and required verification via script ([03:52:10](#03:52:10)).

* **Strategic Project Roadmap**: The team discussed the purpose of the rapid assessment document for Shinasty and established a plan for moving forward following client approval. They identified the need to separate project phases into pre-sales/rapid assessment and implementation/automation, focusing on determining which tasks to automate and which require manual human oversight ([03:56:33](#03:56:33)).

* **NetSuite Implementation Priorities**: The discussion shifted to focusing on NetSuite-native tasks before integrating Celigo. They reviewed a list of tasks, including customer deposit payment link validation, member portal returns, exchange reconciliation, inventory sync, month-end close, and prepayment evaluation ([03:59:14](#03:59:14)).

* **Vendor Prepayment and Script Cleanup**: Imran Shabbir and Michael Flynn discussed challenges with vendor prepayments and the need for deeper investigation into enabling native NetSuite functionality rather than using workarounds. They agreed to clean up the meeting summary to remove irrelevant or outdated comments ([04:02:32](#04:02:32)).

* **Order Placement Process Review**: The team identified the immediate next step for the Shinasty project as a review of the order placement process and the customer deposit integration to determine if the current design required modifications ([04:03:37](#04:03:37)).

* **Role of AI in Discovery and Implementation**: Michael Flynn and Imran Shabbir debated the utility of an AI assistant during discovery sessions. They acknowledged that while AI can help generate templates and enable features, human guidance remains critical for shaping client decisions and providing strategic direction ([04:04:50](#04:04:50)).

* **Manufacturing Project Case Study \- Grinds**: The team used a manufacturing client, Grinds, as a practical example for optimizing the item master and unit of measure data. They discussed using safe searches and automating the identification of unused items or incorrect units of measure, such as converting between volume and weight ([04:06:55](#04:06:55)).

* **Automating High-Level Tasks**: The team explored whether high-level tasks from a rapid assessment document could be delegated to AI. They concluded that they must first conduct a discovery session to define the solution before asking the AI to perform specific, granular steps, such as listing unused items ([04:10:06](#04:10:06)).

* **Project Engagement and AI Assistance**: Michael Flynn reflected on the workflow for client engagements, emphasizing the value of the consultants acting as guides rather than merely "turning nuts and bolts." They discussed using AI to perform preparatory data gathering to maximize the time spent on value-added advisory work ([04:13:39](#04:13:39)).

* **Executing Feature Enablement**: The discussion centered on enabling features like supply allocation. They noted that this requires prerequisites, data validation, and reformatting transaction forms to ensure a logical sequence, all of which could theoretically be managed through AI assistance ([04:15:55](#04:15:55)).

* **AI Tool Execution and Strategy**: Michael Flynn and Imran Shabbir tested using the AI to query which tasks could be executed immediately using MCP and SDF connections. They also touched on the potential for AI to build approval workflows or scripts directly within NetSuite ([04:17:52](#04:17:52)).

* **Scripting vs. Workflow Debate**: The team debated the preference for scripting versus building workflows in NetSuite. They generally agreed that scripting is often more efficient and reliable, though workflows were once favored for user accessibility. They noted that AI now facilitates efficient script creation, reducing the necessity of relying on standard workflows ([04:20:09](#04:20:09)).

* **Efficiency in Scripting via AI**: Michael Flynn highlighted the efficiency of using AI to write scripts for specific tasks, such as rounding vendor pricing to two decimal places. They noted that AI-generated scripts often provide higher confidence than complex workflows when addressing these requirements ([04:23:15](#04:23:15)).

* **Future of AI in NetSuite**: The team speculated that as NetSuite’s built-in AI capabilities evolve, the traditional workflow interface may become less necessary, as future AI iterations could automate these processes directly ([04:25:21](#04:25:21)).

* **Technical Constraints on AI Integration**: Michael Flynn and Imran Shabbir identified specific limitations, such as a read-only MCP role and the inability of the AI to directly pull APM (Application Performance Management) performance data, as that data resides within Suitelets ([04:26:29](#04:26:29)).

* **Managing Script Reviews**: They addressed the scale of the client's system, noting approximately 658 to 700 scripts. They concluded that scanning all scripts is inefficient and that AI should only read scripts targeted to specific, high-priority tasks rather than attempting a global review ([04:28:26](#04:28:26)).

* **Personal Conversation and Scheduling**: The participants engaged in a diversion regarding food, various media and pop culture references, and confusion over time stamps and overlapping comments on project documents ([04:31:25](#04:31:25)).

* **Sports and Cultural Commentary**: The conversation shifted to sports, including commentary on international soccer, the U.S. national team, sports infrastructure, and the socioeconomic aspects of various sports globally ([04:36:31](#04:36:31)).

* **Professional Sports Backgrounds and Youth Development**: The discussion continued on athlete development in the Dominican Republic and Europe, comparing those systems to the "pay-to-play" model in the U.S. and the impact of commercialization on youth sports like baseball and soccer ([04:42:12](#04:42:12)).

* **Client Engagement and AI Adoption**: The conversation touched briefly on project management with other clients, including PSG, and the challenges related to sandbox environment access and documentation ([04:46:22](#04:46:22)).

* **Project Management and Team Dynamics**: The participants discussed past client experiences with AI adoption, specifically mentioning a client who independently managed AI-driven scripts. They also compared the operational challenges and turnover at clients like Barbell ([04:47:28](#04:47:28)).

* **44 Pro Invoicing and Communication**: Michael Flynn requested a draft email to 44 Pro to provide updated invoice copies and reflect the email thread. The conversation included a reference to "Ann," a CFO at RMR, who previously caused confusion regarding financial terms ([04:50:34](#04:50:34)).

* **44 Pro Scope Verification**: Michael Flynn and the team discussed whether the engagement was explicitly defined as not being an Managed Service Provider (MSP) project. They addressed the client's assertion regarding Amazon channels or markets being missed during implementation, which Michael Flynn disputed, noting that they had no prior knowledge of those specific markets ([04:51:45](#04:51:45)). Michael Flynn also noted that the client's decision not to choose an "all-you-can-eat" model is expected to cost them 15 to 20 hours of additional work ([04:54:20](#04:54:20)).

* **Actionable AI Strategy**: The team decided to pause the current discussion to focus on making future workflows "actionable" using AI during the next session ([04:54:20](#04:54:20)). Michael Flynn proposed using AI to analyze Amazon Seller Central data, such as first-order dates, to verify when specific stores were activated, which would provide factual evidence for resolving project disputes ([04:53:11](#04:53:11)) ([04:55:20](#04:55:20)).

* **AI Integration and Human Oversight**: The team explored how to integrate AI into rescue projects and new implementations while maintaining human control ([04:55:20](#04:55:20)). Michael Flynn emphasized that while AI can create project plans and custom records, it should serve as a tool for consultants rather than an autonomous decision-maker, particularly given the risks of modifying customer systems ([04:57:53](#04:57:53)) ([04:59:43](#04:59:43)). The current workflow involves using a "use case generator" and "cloud code" to plan tasks before handing them off for implementation, ensuring that developers review AI-generated scripts before deployment ([04:58:48](#04:58:48)).

* **Consultant Communication Standards**: Michael Flynn provided guidance on improving client-facing communication, specifically advising against sending overly long emails ([05:00:52](#05:00:52)). It was emphasized that the US-facing consultant bears responsibility for customer relationships, and developers should be coached to avoid creating issues during client interactions ([05:01:44](#05:01:44)).

* **Amazon Marketplace Scope and Technical Verification**: The group confirmed that Amazon Canada and Mexico marketplaces were active prior to go-live, though they had minimal activity and were not initially identified as part of the implementation scope ([05:01:44](#05:01:44)). Michael Flynn explained the technical reality that these stores are accessed via separate menus, which contributed to the oversight during the initial configuration ([05:02:49](#05:02:49)).

* **Liability and User Acceptance Testing**: The team reflected on the "gray area" of project scope, noting that while clients often do not understand their own requirements, the User Acceptance Testing (UAT) process should have identified the missing marketplace configurations ([05:05:29](#05:05:29)). Michael Flynn expressed that responsibility is shared, noting that the client's UAT was insufficient, though a new developer had recently provided a list of 25 use cases to improve future testing ([05:06:52](#05:06:52)).

* **Logistics and Social Planning**: The team concluded the formal meeting, coordinating carpool arrangements and discussing potential evening activities, including a baseball simulator and dinner plans in Houston ([05:07:50](#05:07:50)).

* **Future Execution Planning**: Looking ahead to the next session, the team plans to focus on creating a baseline execution plan using AI and incorporating Taha Raja's "weekly executive summary" skill ([05:14:31](#05:14:31)). The goal is to move beyond investigation and establish a consistent, organized approach to daily tasks ([05:15:41](#05:15:41)).

* **Resolving 44 Pro Project Discrepancies**: The team discussed the 20 to 30 hours of work required to resolve the 44 Pro project issues and the lack of clarity regarding the establishment of a separate project ([05:16:35](#05:16:35)). To preserve the long-term customer relationship, the team decided to offer future credit for the work rather than providing free NetSuite views, acknowledging that both sides share responsibility for the initial misunderstanding ([05:18:51](#05:18:51)).

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*How is the quality of **these specific notes?** [Take a short survey](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?confid=iRUAwyJhe5GFBnhxDZ-mDxIROAIIigIgABgBCA&detailLevel=standard&hasImages=False&entryPoint=footerMain&isGoogler=False) to let us know your feedback, including how helpful the notes were for your needs.*

# **📖 Transcript**

Jul 29, 2026

## **AI Summit \- Transcript**

### **00:02:03** {#00:02:03}

**Taha Raja:** There's one in College Station. This legacy works. Is it College Station or College Station? What's that? This Legacy Works. Yeah, but College Station has a lot of companies out there. Not small companies that do research there university. So they would have offices then. That's right. But they have sometimes just individuals, professors who are visiting who are there for three weeks. I found the document. Yeah, it's got more than but it says produced in this meeting and it's only 22 seconds long. I don't know what happened. Yeah, now I didn't back out of it or anything. That's weird. So graduate. Well, I I pulled up the video and on the video on the right hand side, it has I'm surprised at Oh, okay. You can actually create an audio over here too. Yeah, it's really cool. But I'll I'll uh I'll re I'll recreate the I'll recreate the summary. There's also ways of even just running the video in a new meeting and having it transcribable in there.

### **00:03:22** {#00:03:22}

**Taha Raja:** The only thing there is you you lose the context of all the speakers. Yeah, never replied to your nobody acknowledged or anything. Just I I didn't get a result. I'm betting the AI just get something really close to what the That's I was not to be honest.

**Michael Flynn:** Oh,

**Taha Raja:** Oh, no.

**Michael Flynn:** no.

**Taha Raja:** No, I didn't.

**Michael Flynn:** That that probably I think I think they have realized,

**Taha Raja:** But that's that's

**Michael Flynn:** you know. No, I've gotten a video that's an hour and five minutes. Okay. I was looking at my No,

**Taha Raja:** That might have been 20\.

**Michael Flynn:** there was a second to see if all the settings were correct.

**Taha Raja:** That's when I restarted

**Michael Flynn:** Okay. So, the regular one was an hour and five minutes.

**Taha Raja:** just

**Michael Flynn:** Okay. That's And it shows off that aside kind of summary. It's not as detailed as what we normally see, but I'm sure I can. It's AI enabled. So, I can say give me the full transcription and a detailed summary with next step action items.

### **00:04:23**

**Michael Flynn:** So, I'll do that and then I can just throw that in a word doc. Um, if we have the

**Taha Raja:** China connection built out the MCP connection anyone who has our claw access can use it or do you have to allow they'll have to reauthenticate each time such if such wants to use it should be there for and then you know we have the afternoon

**Michael Flynn:** Guys, let's get

**Taha Raja:** to take care of all the companies stuff.

**Michael Flynn:** started.

**Taha Raja:** So, um, you want me to Oh, yeah, we can. And, uh, Imran, I was going to have you drive a little this morning. Mhm. Y connection.

**Michael Flynn:** you have one.

**Taha Raja:** If you

**Michael Flynn:** If you want to connect to the TV, just go to your Wi-Fi

**Taha Raja:** What was it? There's Justin.

**Michael Flynn:** and

**Taha Raja:** You go to the Wi-Fi and just connect to the screen. I just do. We have to set up something here. I don't think so. It should need to connect.

### **00:05:26** {#00:05:26}

**Michael Flynn:** it might ask you like it's going to tell you to confirm

**Taha Raja:** Yeah, you might have to. It's going to ask you on the screen. Should allow him to connect.

**Michael Flynn:** Got it.

**Taha Raja:** So, what do I need to do from my left? Go on the bottom right where your Wi-Fi stuff

**Michael Flynn:** Scroll down to where you can

**Taha Raja:** is.

**Michael Flynn:** cast.

**Taha Raja:** Screencasting. Open up the way your

**Michael Flynn:** I can actually

**Taha Raja:** Perfect.

**Michael Flynn:** yeah cast it'll take a second but it should pop up and say like allow your computer's connected Scared.

**Taha Raja:** You probably should join

**Michael Flynn:** the meeting. We can share that screen.

**Imran Shabbir:** Okay.

**Taha Raja:** It look cool.

**Imran Shabbir:** You did have to

**Michael Flynn:** Is this thing? Yeah, it was again. So at some point between now and the end of the meetings we we want to

**Taha Raja:** about standardizing this executive summary process that I've created.

**Michael Flynn:** talk

**Taha Raja:** Yeah. Yeah.

### **00:08:38** {#00:08:38}

**Taha Raja:** I I thought we'd kind of go linearly like Right.

**Michael Flynn:** through the assessment.

**Taha Raja:** have it.

**Michael Flynn:** Yeah,

**Taha Raja:** I'm forcing all my team members who are doing all these different projects to do one. And uh it's it's it's a really because I saw the skill.

**Michael Flynn:** it's becoming a really good process.

**Taha Raja:** Yeah. In the clouds. Yeah. We'll probably have to adjust.

**Imran Shabbir:** Because the skill is set up to use your MCP connection and use that query to query the hours and I don't know if all of us are going to be able to do no no you so I

**Taha Raja:** feeding. You don't have to adjust it to feed your hourly report. Y.

**Imran Shabbir:** think

**Taha Raja:** So, absolutely. Yeah. of you gone yesterday.

**Michael Flynn:** noticed that that skill was there. I was like, "Oh, I noticed that right away." I was like, "Yeah, we'll probably have to switch ourselves a little bit."

**Imran Shabbir:** what is a skill

**Michael Flynn:** Yeah.

### **00:09:20** {#00:09:20}

**Imran Shabbir:** Hello.

**Michael Flynn:** Skill is exactly that you're giving

**Taha Raja:** a set of instructions and knowledge that Claude can remember so that the next time

**Michael Flynn:** do something and you want it.

**Taha Raja:** you and again and correct me if I'm

**Michael Flynn:** So skills

**Imran Shabbir:** If I understand it's

**Taha Raja:** wrong Mike is that Claude will use a skill if it thinks you don't have to explicitly tell

**Imran Shabbir:** going

**Taha Raja:** use this skill all the time. Although you can, right? But u if you give it some question or instruction to do something, it will look at all its skill and say, "Oh, I have this skill. I can use it." Gotcha. And it's basically a set of instructions and processes that are unique for that specific thing that you wanted to learn and understand. So like, you know, I gave it a skill of saying, well, how do you create an executive summary for Power Cloud? I gave it some and you know you can put that in the cloud MD file as one way but like I think we talked about it yesterday but MD file can get too big so it's better to split this stuff into skills so that it knows when to use that skill or you can explicitly say use this skill to do this right so skills appear in the folder structure uh yeah they they but in the in the in the uh team thing you can actually share a skill

### **00:10:39**

**Taha Raja:** So like I've shared the skill for the executive projects and all that and then the other thing also is in the skill um uh you know you can download skills like you know uh there are like I think there's a whole marketplace of skills. Yeah. Yeah.

**Michael Flynn:** create a skill on on uh you know creating then I give you examples. Yeah, exactly. I mean you know there

**Taha Raja:** It's nice because it then you know instead of rediscovering that process cla can short circuit the whole process because you've already done the process so it knows what to do because remember the bad thing about claude is every time you start a thing it's basically like a blank slate right and that's the thing and so start a conversation right and it doesn't have like endless memory either which is another problem it's not a problem it's just that's how they are making it efficient to be delivered over the So, this is weird because I know when I when I cuz

**Michael Flynn:** started off with Chad GP Jet GPT almost exclusively and I still use it from time

### **00:11:31**

**Taha Raja:** I

**Michael Flynn:** to time and uh so a lot of my visits to different customers I would have conversations uh to McGomery

**Taha Raja:** last one when I went out started making references to other

**Michael Flynn:** Alabama and cloud will will

**Taha Raja:** chats we had had thing to some extent.

**Michael Flynn:** actually do the same. Um, but less so when you're using like a cloud code session, right? A cloud code session makes sense, right? It's more siloed.

**Taha Raja:** all it that's in the folder that you've told it to start in. It's why you actually can't just use cloud code purely on the web. You have to you do have to have structure somewhere that it can live in and crawl

**Michael Flynn:** a directory.

**Taha Raja:** through. So clearly these these skills are a file.

**Michael Flynn:** So, okay. Oh, it's MD.

**Taha Raja:** file. That's what I was going to say. Is it basically its own MD file? Yes, you don't have to write it like if

**Imran Shabbir:** like I created one like I think you even told about this like to like wrap

### **00:12:34** {#00:12:34}

**Taha Raja:** you

**Michael Flynn:** of the day when I'm working on a co project.

**Imran Shabbir:** up for the day everything I've done today save it to your memory write it to a memory file push all my stuff into G

**Taha Raja:** make sure everything basically wrap up my day with this project. So everything's saved, backed up, everything and I just go slap and it's done. Yeah. Well, it does it. And uh one other skill that I've created is, you know, I I told it to scour my personal documents I've created over the past three years. Mhm. Uh on my local drive, on my Synology and all that, my emails, my personal email and it learned how I write documents, how I talk, how I so that when it creates a document that I create, it's doesn't look like AI. It's more and more like me. Important thing because you know,

**Michael Flynn:** And that's an important

**Taha Raja:** I've noticed that you get too much slack when you just give it a blank statement saying create this document.

### **00:13:37** {#00:13:37}

**Taha Raja:** And it's still learning. I'm I'm I'm seeing the refinements but it's it's I think it's important that every person does that because like yesterday we saw there was just this verbose stuff there was these flowery words that would people would immediately recognize I don't talk like that right and then what happens is when people receive those type of emails or documents people lose interest because it's like okay this is this is computerenerated yeah I'm not going to closely read this Yeah. I mean, and so I don't know. I feel like it's it's a little push pull there because like they know we're using AI to generate no AI. But I I wanted my voice though. AI is my assistant. It's not speaking for me. I don't disagree. Yeah. But yeah, at the same time it's like yeah to some not in a

**Imran Shabbir:** You kind of have to expect it to be good generated being a close

**Michael Flynn:** computer generated with.

**Taha Raja:** doc me correct when you don't read your own document and you

### **00:14:35**

**Imran Shabbir:** monitor.

**Taha Raja:** give something that is computerenerated people say this is not you at least I feel that way. Yeah yeah yeah I discard I most of the time 90% of the time I discard those kind of emails like this is he's not talking to me. Yeah. Yeah. I haven't well like

**Michael Flynn:** ones that marketing email. Yeah. The ones that automatically that Gmail is doing today. Yeah. Yeah. I I I end up just highlighting over this. And yeah,

**Taha Raja:** I'll polish certain things,

**Michael Flynn:** I mean because normally what happens is you

**Taha Raja:** you know. Yeah. I mean, all this stuff

**Michael Flynn:** go like um evolution usually is very flat for very long periods of time and then you have some event that happens that then there's massive changes over you know relatively short period of time geologically speaking. So here what's happening is again our the way we do business and the way we work evolves very slowly and now all of a sudden it's super rapid.

### **00:15:34**

**Michael Flynn:** There's all these changes and so these little refinements and being able to share these and collaborate these is like super cool stuff. And I I we're not trying to hide No. survival.

**Taha Raja:** the AI. We're trying to make it so that it increases your productivity and we're transparent that we're using it. Yeah. But I think delivering content that doesn't reflect your voice is impersonal. Yeah. Yeah. And you are not being respectful. Well, and if you're if you're

**Michael Flynn:** Starting off with the I'm going to proofread all this.

**Taha Raja:** start

**Michael Flynn:** Yes. To make sure that it's right. Yeah. And I had a journalism background, so that's it's already built into me to proofread

**Taha Raja:** everything,

**Michael Flynn:** it.

**Taha Raja:** but um but then with that

**Michael Flynn:** These ideas of now how do I refine it and have it sound more like me as I go along?

**Taha Raja:** like

**Michael Flynn:** I don't think the proof reading goes away, but then more and more you even say, "Hey, do a I write an email. How's costing work in netswuite?" Which I had to do for one client.

### **00:16:30** {#00:16:30}

**Michael Flynn:** Well, one of the other things

**Taha Raja:** I've given a very explicit instruction is that start you stop using flowery language, stop using verbose something that you said in one short sentence. So you guys saw mine yesterday, right, when it was going through it like the last step as it went through and it's like I think it literally said Mike hates M dashes. Make sure we go through scrub all these dashes. I I I still see M dashes on mine and I I'm working to get rid of those because that's a clear indication that it's AI. And now you may still like M dash and keep it, but most people never use it. Did you see the

**Michael Flynn:** clip of the professor who did a midterm essay for his or his students had to do a midterm

**Taha Raja:** video?

**Michael Flynn:** essay and 95% of them failed because what he did was he hid a sentence in there in white font. Yeah. So he knew if they either copy and pasted or if they just threw the file in the AI because the the sentence was basically add one paragraph about Madagascar and have it make no sense whatsoever.

### **00:17:27**

**Michael Flynn:** And so so every every essay he got with a paragraph of ma Madagascar he was like f he was like because this was done by AI that is smart skills are free right now right can we build

**Taha Raja:** I'm sure there's going to be a there's

**Michael Flynn:** I'm sure can be a skill right they're

**Taha Raja:** the barrier to low.

**Imran Shabbir:** Recreating a skill is fairly

**Taha Raja:** Yeah. like there is a context and everything to it, but honestly, I've just had Claude write the skills for That's what I did with the rap. I was like, "Hey, I want to generate a skill. Then I can just give you

**Imran Shabbir:** And do the these four things at the end of the

**Taha Raja:** one.

**Michael Flynn:** Go ahead. Uh hierarchal last question about that.

**Taha Raja:** Can skills

**Imran Shabbir:** day.

**Taha Raja:** be

**Michael Flynn:** Um so like you said end of day well if there were a whole series of skills there can be multiple skills used in a certain uh event or conversation but I don't hierarchy would I've never need to be

### **00:18:27**

**Taha Raja:** if I heard of that?" probably

**Michael Flynn:** I'm not I don't see what you're saying though if you have a if I have a skill if I would have

**Taha Raja:** doesn't

**Imran Shabbir:** separately and said, "Okay, save this to

**Taha Raja:** save write your memory. Yeah.

**Imran Shabbir:** me.

**Taha Raja:** And push to get and that is two different skills. And then I said, okay, write me a skill to do both of those things. I think that's what he was going hierarchy.

**Michael Flynn:** or just like can it chain them together automatically. So for example, if you say do my normal end of day and normally your end of day is 10 different things that are all completely different that already have skills associated with them but you want them to be executed in a certain order maybe. Okay, maybe not. I think you would just put that inside. Good. So, here's kind of the high

**Taha Raja:** from like the CL.

**Michael Flynn:** level.

**Taha Raja:** I was looking for this the uh we took a claude court sign up.

### **00:19:21** {#00:19:21}

**Michael Flynn:** Somebody.

**Taha Raja:** this came up in it. Yeah. So the what should Claude know every single session that goes into the cloud MD file or there's

**Michael Flynn:** rules file. Are you sharing something? I'm not. I'm just reading. Okay. What should Claude know only sometimes when you call it on demand? That's a skill. Yes. Um what um what must happen whether or not Claude So this is like if you want

**Taha Raja:** decides to um want to intervene and say sorry Mike can you backtrack and what was the

**Michael Flynn:** one. He's not displaying. No, no. Okay. Just tell. Yeah. Yeah. So, things that Claude needs to know every single session when you pop it up, no matter what, always follow these rules. That goes in your cloud. File. Okay. What do you want to?

**Taha Raja:** much on demand like okay it's the end of the day I want to wrap up that is a skill and then there's these things called hooks which actually can say oh we're writing a document let's intervene here and go through the human language checker that that is you put a hook in which then reference a references a skill.

### **00:20:30**

**Taha Raja:** So the hook says anytime this go ahead and grab this skill and load

**Michael Flynn:** Huh? Action happens.

**Taha Raja:** it up. And then MCP is basically an API for does it mention

**Imran Shabbir:** You use the plugin cuz we use that human voice or brand voice plugin also.

**Taha Raja:** when

**Imran Shabbir:** Yeah. Um, that one Is

**Michael Flynn:** not in this article but let's

**Imran Shabbir:** it?

**Taha Raja:** I'll share I'll share this document. Okay.

**Michael Flynn:** uh like plugin was also free but I'm

**Taha Raja:** Sure. They will soon

**Michael Flynn:** Watch out.

**Imran Shabbir:** ing all of these. Yeah. All right. So

**Taha Raja:** Last night I kind of rewrote some of our um I rewrote some I rewrote our process docs here and we're going to look at

**Imran Shabbir:** Oh,

**Taha Raja:** the changes we made in a second. But what I want to do is I want to rekick a shinasty thing while we do this. So when you say rewrote documents, what do you mean by that?

### **00:21:27**

**Taha Raja:** So I rewrote the cloud. MV file. I actually moved moved some of the actions into the

**Michael Flynn:** some of it pertinent to this. Satching.

**Taha Raja:** skill um around into skills around like using the MTP server to get data double-checking some of this stuff um talk about how I did it and everything but like but let's get Claude going on something and then we can kind of keep talking. So we'll if we redo this Claude will use that skill go through the MCP and the notes and everything and see what it creates. So one thing it is going to do now it is going to interview us a little bit more. It's going to be a little bit more less assumptive and word assumptive. It's going to make less assumptions and it's going to ask you questions or it should ask you questions if it's not sure about things and uh make it a little bit more interactive for better or worse. I think the results will be better whether or not this is something we want or whether we should push for

### **00:22:29**

**Michael Flynn:** be more autonomous I think is something we

**Taha Raja:** it to uh discuss.

**Michael Flynn:** can

**Taha Raja:** But I feel like early it's okay if we're taking a 12-hour process

**Michael Flynn:** making it by answering a hand I think we should kind of do our follow our own suggestion here right we tell

**Taha Raja:** and

**Michael Flynn:** our customers don't completely

**Taha Raja:** automate everything until you've used it for a while and you're absolutely

**Michael Flynn:** how you want it to work.

**Taha Raja:** sure

**Michael Flynn:** I think we could follow exactly. Yeah. I even started one yesterday on temper side literally saying here's what I remember

**Taha Raja:** on They're studying.

**Michael Flynn:** about their environment from a WS standpoint before I get started with my question. Do you have any thoughts? Do you have any, you know, checks on my accuracy? Anything else you want to bring up regarding the notes we have? Yeah. So

**Taha Raja:** Let's flip over to code here

**Michael Flynn:** in

**Taha Raja:** and change the shiny folder there. Uh say open folder and just back up

### **00:23:30** {#00:23:30}

**Michael Flynn:** one level basically I made a

**Taha Raja:** one redo folder.

**Michael Flynn:** shiny ass

**Taha Raja:** uh in project folders. Yep. And

**Michael Flynn:** suspense um

**Taha Raja:** this

**Michael Flynn:** and based

**Taha Raja:** basically the only thing I did was I moved the source folder with all our source documentation or I copied the source folder into this folder. Mhm. Um and folder.

**Michael Flynn:** So you you can actually go up one level.

**Imran Shabbir:** We just want to select the shin seat. redo. Yep. You need to select that and you can say

**Michael Flynn:** And I put a prompt in our meeting chat.

**Taha Raja:** AI run a power cloud rapid assessment.

**Imran Shabbir:** for shiny and produced the three deliverables using your normal process. This is an existing account. Remote engagement now moving to weekly working. The discovery transcripts are in this um slash

**Taha Raja:** source. This

**Imran Shabbir:** is not deliberately you put it right. Yeah. Tell the folder. It's a folder.

### **00:24:42**

**Imran Shabbir:** Real quick, what what call are we on the AI Summit 8 to6 or the PC AI Summit? Um, I only had one in my calendar,

**Taha Raja:** Oh, never mind. I block. That's me. Okay. I I had blocked it off. Never mind.

**Michael Flynn:** On a side note, do you see Ron's response in the warehouse channel? I know what is this to work on,

**Taha Raja:** said office is much better as

**Michael Flynn:** but warehouse still got that burning smell. That is

**Taha Raja:** yesterday. Okay, he's got all the fans going as well just like yesterday to so we just need to get a large this prompt is in addition to the once

**Imran Shabbir:** context which also has

**Taha Raja:** it starts moving and we're going to pause we're going to open up that file

**Imran Shabbir:** correct

**Taha Raja:** And how does it know that it has to refer to that document?

**Imran Shabbir:** because you're starting in the folder.

**Taha Raja:** Because it's in the so when it scans the

**Imran Shabbir:** Yes.

### **00:25:49**

**Taha Raja:** folder, see there's MD,

**Imran Shabbir:** filing going. Yeah. So essentially as soon as it starts doing

**Taha Raja:** it says, "Okay, where's my claw MD file?" It's going to tell me what to do.

**Imran Shabbir:** any

**Taha Raja:** The claw file will of course tell it to reference other files, but that's it. Maybe I did not. Um, I'll make a call

**Michael Flynn:** We have the ceiling.

**Taha Raja:** to

**Imran Shabbir:** use kind of still I think we are still figuring it out when to use the scale versus when to use

**Michael Flynn:** I think you answer it.

**Imran Shabbir:** the

**Michael Flynn:** changes air flow.

**Imran Shabbir:** versus what should be in the or is it iterative conversation? Do you think there's more? I I think we're I think fine-tuning

**Taha Raja:** part of what we should be talking about. What should be a prompt? What should be in the standards?

**Michael Flynn:** This is pretty general. It is. Yeah. I'd say let's let them come back and say here's what this and the combination of document I

### **00:26:47** {#00:26:47}

**Imran Shabbir:** Yeah. So, so the prompt I used your prompt was much longer and document.

**Taha Raja:** a good result but then I don't have any instruction also even if the prompt is

**Imran Shabbir:** Exactly. Like my goal is is to make this repeatable.

**Taha Raja:** not exactly the same every time. It's going to be ultimately I want a pro. I I want something that knows what to do with less of a prompt, but it's going to take some it's going to take a little back and forth to

**Michael Flynn:** Okay. Um,

**Taha Raja:** get

**Imran Shabbir:** Oh,

**Michael Flynn:** yeah. Was there anything else we agreed

**Imran Shabbir:** but you already changed the instruction documents too. Okay. Yeah, I changed the instruction documents.

**Taha Raja:** basically I gave it my thought.

**Imran Shabbir:** I document.

**Taha Raja:** I gave it your thought.

**Imran Shabbir:** I gave it your prompt and I gave it the

**Michael Flynn:** from our meeting yesterday and said and just had some back.

**Taha Raja:** forth last night that said, "Hey, how do we more align on what the group is looking for?" Um,

### **00:27:42** {#00:27:42}

**Imran Shabbir:** Doesn't matter what model were

**Taha Raja:** does it using it here? I mean, I know it matters,

**Imran Shabbir:** you

**Taha Raja:** but what are the thoughts on

**Imran Shabbir:** which one to use like in certain scenarios I guess.

**Taha Raja:** um

**Imran Shabbir:** Yeah. So for the for your prompt, I would generally go with the default model. This is

**Taha Raja:** I think it's sonnet right now. Sonnet five. Other than the absolute now, there should be instructions inside that when it

**Michael Flynn:** launches sub agents, which it should do on its own.

**Taha Raja:** It choose it's a little um that makes

**Michael Flynn:** That

**Imran Shabbir:** a little bit more intelligent about what model it chooses.

**Taha Raja:** sense

**Michael Flynn:** cuz you're breaking off into a more

**Imran Shabbir:** Some agent that needs to do something

**Michael Flynn:** intensive.

**Taha Raja:** specific.

**Michael Flynn:** Maybe you would obviously want a higher model. Higher model or often less if you just

**Taha Raja:** this the the agent that spawns just to write the document probably does not need to be a higher model.

### **00:28:51** {#00:28:51}

**Taha Raja:** That's where you go when you honestly I think we'll probably wait till the AI.

**Michael Flynn:** developer is really in the mix to try to fine-tune too much of that.

**Taha Raja:** So this is why we want to develop our own tool because in the interview process when we were trying to hire

**Michael Flynn:** Yes,

**Taha Raja:** AI engineer we asked him how do you your

**Michael Flynn:** you optimize this. And he said that when you do a develop

**Taha Raja:** own tool using AI you can give it specific instructions that on this task use this model on this task use this model so there's all these different things you can do right now that's the challenge of using just the standard interface is you pick a model and then and everything you're doing as you switch it between comments well even when when you switch it sometimes I've seen where it starts over sometimes right it doesn't remember properly and all that so you know there's all these challenges right so which would not exist because when you are doing coding you can hand over things more deliberately yeah right so so that you're doing specific things properly so anyway it's no that it's like writing sub routines and libraries right so you know so yeah yeah exactly that's exactly what I thought You just call it a library.

### **00:30:02**

**Taha Raja:** Yeah, exactly. Um, for today you want to change that except edits to for auto. I would not usually do this but just so that we can continue our conversation. Don't have to approve every single little thing today.

**Imran Shabbir:** At what point do we feel like it is okay to do that? And I know it's I don't I don't

**Taha Raja:** Very good answer.

**Imran Shabbir:** really

**Taha Raja:** Um,

**Imran Shabbir:** ask the clarification question. This is just Yeah. Yeah. This is just Can I

**Taha Raja:** write file or something like that. And can I use the What's the other one?

**Michael Flynn:** Click on that again.

**Taha Raja:** What's that's

**Michael Flynn:** I know I looked at this whole bypass permissions.

**Taha Raja:** like god mode. It's just Yeah, that means it's just doing whatever. Yeah, it might rewrite Windows for you.

**Imran Shabbir:** just like that chat GPT agent did, right? Like I'll do I'll do the auto when I'm like writing a like working on a script or something like

### **00:31:09**

**Taha Raja:** Yeah. Before I deploy it,

**Imran Shabbir:** that.

**Taha Raja:** like on the deploy part, it's like no, no, you need to still ask

**Imran Shabbir:** You're going to go write a script. Don't ask me to, you know,

**Taha Raja:** me.

**Imran Shabbir:** approve six different things. Yeah, I I think that mostly

**Michael Flynn:** This channel sounds,

**Imran Shabbir:** make

**Taha Raja:** Okay. This is gonna go through expected to come through and um I mean you said it took an hour or so you want to

**Imran Shabbir:** Yeah. So, let me

**Taha Raja:** leave this up. So in

**Michael Flynn:** Ask any questions. You can see it too.

**Taha Raja:** case looks like

**Imran Shabbir:** I'm not sure they are. It's

**Michael Flynn:** You roll the track. Oh,

**Imran Shabbir:** funny.

**Michael Flynn:** all right. Let me give you now. Can

**Taha Raja:** Just send you another hyperlink in chat.

**Michael Flynn:** I

**Taha Raja:** It should open up assessment by Mike Flint.

**Imran Shabbir:** So this is what's

**Taha Raja:** This is an artifact.

### **00:32:15** {#00:32:15}

**Imran Shabbir:** hard.

**Taha Raja:** This is something new to me. I haven't used artifacts a lot. I haven't just kind of came up with it.

**Imran Shabbir:** This is essentially like documents that you can share with

**Taha Raja:** But this in your Claude team, I think, at least that's how we're using it for this one. So, this goes through what we changed last night. So, I thought while Claude is running the assessment, we can talk through what we what I actually changed. So, this should all be based on

**Imran Shabbir:** we talked about yesterday.

**Michael Flynn:** What we process,

**Imran Shabbir:** So what changed in the

**Michael Flynn:** the workflow that turns discovery calls into a client assessment was rebuilt around one goal,

**Imran Shabbir:** assessment?

**Michael Flynn:** a tighter, factual, harder to fake. They talk to him.

**Imran Shabbir:** comes up the same way no matter who runs it. like for one sentence. I think that's that's perfect accurate of what we're engagement

**Taha Raja:** Yep. validated

**Michael Flynn:** the shiny deliverables no client facing change to the promise not sure

### **00:33:05** {#00:33:05}

**Taha Raja:** against.

**Imran Shabbir:** same

**Michael Flynn:** what um so let's talk instruction file to a

**Taha Raja:** U one

**Imran Shabbir:** that runs itself.

**Michael Flynn:** skill asking about before we had

**Imran Shabbir:** So this ties into what you guys were

**Taha Raja:** biggest

**Imran Shabbir:** just compile that held every

**Michael Flynn:** a 27 kilobyte instruction

**Imran Shabbir:** rule output quality rose or fell without

**Michael Flynn:** consultant happened to prompt it. Now we have a lean orientation.

**Imran Shabbir:** issue.

**Taha Raja:** file plus a load on demand skill and reference file.

**Michael Flynn:** So we used your output yesterday as a reference document. I'll put that.

**Taha Raja:** that they created as far which doc the the existing rapid. Yeah, the same procedure runs every time for what the

**Imran Shabbir:** kicks it from a one. That's the document

**Taha Raja:** client feel.

**Imran Shabbir:** before

**Taha Raja:** So this was an artifact that was created. I I asked it. I said I want to explain

**Imran Shabbir:** changes we made to the whole team.

**Taha Raja:** that.

**Imran Shabbir:** Can you make me a sharable document?

### **00:34:12**

**Michael Flynn:** And it is

**Taha Raja:** What is it? Those two words came out of your mouth yesterday.

**Imran Shabbir:** What? Brass tax. Brass

**Taha Raja:** So also and so for it may have

**Imran Shabbir:** tax.

**Michael Flynn:** for whatever reason, whatever I'd gone through Hands.

**Taha Raja:** been because we I I built this immediately after um our meeting with source who is this other AI company. Um it's instruction actually said we

**Imran Shabbir:** a narrative and a

**Michael Flynn:** want to tell this like so like that all gets pulled out

**Imran Shabbir:** novel thing.

**Michael Flynn:** because that's what was causing the flowery language.

**Imran Shabbir:** A lot of

**Taha Raja:** Got it. Got it. Okay. So, you can say before it was verbose and story like 12 to 14 pages, the same problem retold three or four times. Now,

**Imran Shabbir:** that was the source. He was terrible that

**Taha Raja:** I thought it was just crazy. A factual voice, a two to three sentence budget for wants.

**Michael Flynn:** item each problems voice

### **00:35:11**

**Taha Raja:** The deck speaker notes keep a narrative.

**Michael Flynn:** purpose. Perfect. Uh so you say that that the reason

**Imran Shabbir:** like a story is because your instructions kind of told it to. Exactly. Okay. And then one of my criticisms was I thought I thought all that verification not verification stuff was good but didn't belong the so it

**Taha Raja:** front facing document

**Michael Flynn:** H we carried a what we could not verify and why section.

**Imran Shabbir:** said

**Michael Flynn:** Verification stays internal. The document only shows the few verified numbers that land the hardest. real

**Taha Raja:** apps become next steps. Yeah. Yeah.

**Michael Flynn:** gap

**Taha Raja:** I feel like that was a little extra like the like

**Imran Shabbir:** every line had a had a reported and verify. Well,

**Michael Flynn:** a client quot nearly every bullet echoed back at them the pattern we disliked you know outside

**Taha Raja:** Okay.

**Michael Flynn:** fenders so I picked that still got the quotes

**Imran Shabbir:** also in the PowerPoint presentation not in the report.

### **00:36:03**

**Michael Flynn:** for

**Imran Shabbir:** So this is going to change the voice of both right we want both documents to have a consistent

**Michael Flynn:** and style uh document each journey its

**Taha Raja:** Two or three strong quotes across the whole thing.

**Imran Shabbir:** voice

**Michael Flynn:** place. So we left it into submit there for each

**Taha Raja:** He misses no point raised on call could slip through the customer

**Imran Shabbir:** revenue method did exactly that.

**Taha Raja:** deposit a net domain playbook plus

**Imran Shabbir:** uh on every transcript.

**Taha Raja:** completeness pass run

**Imran Shabbir:** So nothing material drops

**Michael Flynn:** Oh, Hey.

**Imran Shabbir:** silent.

**Taha Raja:** hope I mean that's great to say the proof will be in the pudding

**Imran Shabbir:** Um accuracy claims and inference considering leaving Netswuite was stated to the

**Taha Raja:** as fact.

**Imran Shabbir:** client on the

**Taha Raja:** No inferred business conclusion is stated as fact. Every claim increases from

**Imran Shabbir:** job.

**Michael Flynn:** Let's check for self contradiction. Oh, we saw

**Taha Raja:** these are all things that it built into its skill. So just a quick question uh reiterate how did it come up with this document?

### **00:37:07**

**Taha Raja:** what was the instruction set that you did at earlier to create the skill and then come to this conclusion to create this artifact. So what I did yesterday is I started a cloud code session

**Imran Shabbir:** the upper level fold in the

**Taha Raja:** in

**Imran Shabbir:** assessment.

**Michael Flynn:** thing and I said here is Iran's document that we favored for

**Taha Raja:** reasons X Y and Z.

**Michael Flynn:** the

**Taha Raja:** Here's the prompt that Iron used to get this. Here's why we liked it better than And then I said

**Imran Shabbir:** ours uh

**Taha Raja:** also please listen to this transcript from our meeting from yesterday.

**Imran Shabbir:** the back end of this is our discussion of this document of all things and I did have some back and forth with it. I didn't just give it one

**Taha Raja:** Sure. Um,

**Imran Shabbir:** prompt.

**Taha Raja:** we got back That's right. We got back into it and I kept talking to it. Um, landed. So,

**Imran Shabbir:** What do you mean by creating? Um I I never used artifact.

### **00:38:03** {#00:38:03}

**Imran Shabbir:** I used it first time.

**Taha Raja:** so

**Imran Shabbir:** There is a so this so literally if you look at this URL this document that we're looking at on the

**Michael Flynn:** screen is simply called an artifact.

**Imran Shabbir:** screen

**Michael Flynn:** Um I let me tell you what I just So it gives you a link once

**Imran Shabbir:** once it's done it just gives you a sharable link or something it gives you a link

**Taha Raja:** document or word file.

**Imran Shabbir:** that's okay yeah so theoretically if we go to plug code we should be able to see this or you might

**Michael Flynn:** link. I'm not exactly sure.

**Taha Raja:** I I had to set it up right here. I said, you know,

**Michael Flynn:** PowerCloud can view it.

**Taha Raja:** everyone empower the latest version.

**Michael Flynn:** should always share

**Taha Raja:** But all I did to get this artifact was, can you give me a presentable breakdown of what changes we made in the process? Oh, that's good.

**Michael Flynn:** sentence and then I said, "This is a good fit for a sharable page the team can review. Let me build it as an artifact." So,

### **00:38:58**

**Imran Shabbir:** I don't know a lot more about art.

**Taha Raja:** facts. I'll try to do any of us could also just do some research. Yeah, I'm on this because it's it's very interesting because maybe that's a way

**Michael Flynn:** to do some research.

**Taha Raja:** to all the relevant documents relating AI said I don't know like I have a question

**Michael Flynn:** Make sure that all, you know,

**Taha Raja:** like

**Michael Flynn:** would this just be better off as a word document sitting in our folder structure or I have it build HTML.

**Taha Raja:** documents a lot lately because it it seems better at them and the flexibility to like look feel is is unlimited basically. So I was thinking from customer

**Imran Shabbir:** If you think of this

**Michael Flynn:** instead of pres using AI and all that stuff. Yeah.

**Imran Shabbir:** just

**Michael Flynn:** So you

**Taha Raja:** with artifacts do live inside of claude.

**Michael Flynn:** one

**Taha Raja:** So they have to be within our cloud ecosystem. Al if I send it to

**Michael Flynn:** if you sent this if you try to open this link in a private

### **00:39:52**

**Imran Shabbir:** It would a private window that you're not

**Taha Raja:** the it would not like it would not

**Michael Flynn:** You looks like you can import from link into

**Imran Shabbir:** allowed.

**Taha Raja:** artifacts

**Michael Flynn:** your All right.

**Taha Raja:** list.

**Michael Flynn:** So, why don't

**Taha Raja:** Oh,

**Michael Flynn:** we make

**Taha Raja:** sorry. Just scroll up a little bit here. as you want to go check your

**Michael Flynn:** sure it's not waiting on a prompt from you.

**Imran Shabbir:** It is

**Michael Flynn:** Okay. So, this these are like actually questions. Uh

**Taha Raja:** Um, so definitely start completely fresh.

**Michael Flynn:** oh.

**Taha Raja:** So it's a little smarter than we wanted it to be, actually. But what did it ask? I didn't even Well, it

**Imran Shabbir:** the old China folder with all the work we' already done in it. I specifically moved it to a new folder

**Michael Flynn:** Not but it's to the other folder inside.

**Imran Shabbir:** to

**Michael Flynn:** Well, you just told it your your answer was to not to ignore that other program.

### **00:40:50**

**Michael Flynn:** So,

**Imran Shabbir:** go

**Michael Flynn:** all right. So, let's go back to the artifact.

**Taha Raja:** So research is required.

**Michael Flynn:** Uh,

**Taha Raja:** I so I specifically told it to I think it was already in there but I specifically said let's use

**Michael Flynn:** this is like a very minor thing, but yesterday got stuck with it's like, "Oh,

**Taha Raja:** these

**Michael Flynn:** I don't have a shiny logo." And I said, "Go get it from the web." Yeah. So now I've just said explicitly use the customer.

**Imran Shabbir:** website for background and research on the

**Michael Flynn:** Perfect. Um and that includes getting the logo or

**Imran Shabbir:** overview.

**Michael Flynn:** what find

**Taha Raja:** right I've said if you

**Michael Flynn:** gaps, come back and ask me. If there if there's something important that you feel like you need to know,

**Taha Raja:** Yeah.

**Michael Flynn:** go ahead and ask me. Um and that really covers these two, I would say. um fast follow you also asked to uh refer to Oracle documents. Yes.

### **00:41:51**

**Michael Flynn:** Yeah. So,

**Imran Shabbir:** Yes.

**Michael Flynn:** and I gave for the official like the highest level of the official Oracle

**Taha Raja:** You are right.

**Michael Flynn:** Netswuite documentation which is what Docs. oracle.com/english

**Taha Raja:** or something like that. Um, pass list

**Michael Flynn:** breaking like honestly the real answer is we probably just have everybody download our official fonts on

**Taha Raja:** font

**Michael Flynn:** their computer and then it won't matter but right now yeah spend a lot of time looking for that yeah all right so proven not just written we've so it did already in the back it didn't like save a document but it did kind of rerun this through the shiny

**Taha Raja:** again just to check its own work and ultimately it was happy with what it

**Michael Flynn:** thing

**Taha Raja:** did. I

**Imran Shabbir:** I didn't check that out, but I wanted to do that together this

**Taha Raja:** didn't

**Michael Flynn:** um

**Imran Shabbir:** morning.

**Taha Raja:** it failed a few of its checks but it said actually we have

**Michael Flynn:** things already in place to catch those failures.

### **00:42:52**

**Michael Flynn:** So, we're not I'm not It wasn't It wasn't worried about them. uh

**Taha Raja:** What is this or whatever?

**Michael Flynn:** work hard.

**Taha Raja:** So it check So it reran this China thing last

**Imran Shabbir:** I checked it.

**Taha Raja:** night.

**Imran Shabbir:** So needed

**Michael Flynn:** Um ultimately it says it fixed everything

**Imran Shabbir:** to

**Taha Raja:** Pieces where it failed will get re

**Michael Flynn:** in in quality checks at the end of the process. So we're not we don't

**Taha Raja:** I don't need to make any changes. Okay. So again

**Michael Flynn:** So this ties nicely to where what we did this what we were just talking about where it lives.

**Taha Raja:** this

**Michael Flynn:** So the cloud MD file is always loaded on orientation. These are the how hard rules the router and thenment

**Taha Raja:** we have a rapid assessment of whole

**Michael Flynn:** skill loaded on demand when an assessment is

**Taha Raja:** workflow.

**Michael Flynn:** run. um Netswuite playbook domain plus the completeness

**Taha Raja:** across this

**Michael Flynn:** check checklist.

**Taha Raja:** area.

### **00:43:57**

**Michael Flynn:** We have our writing standards markdown document now that is gonna dictate what our writing should look like. And then we have a quality check at the end.

**Taha Raja:** Checkpoints. Um,

**Michael Flynn:** It's

**Taha Raja:** and then to build the fonts in so people don't trust that.

**Michael Flynn:** it's

**Taha Raja:** We'll see. Okay, this is

**Imran Shabbir:** MD. We talked about the skill. We talked about um Netswuite MD document domain

**Taha Raja:** important.

**Imran Shabbir:** patterns for process area plus the completeness. This is something you built yesterday. That is something that was built yesterday. Yeah.

**Michael Flynn:** and we can go read these if you

**Taha Raja:** So using these two

**Imran Shabbir:** I think this is also Yep. That's too And this is also Yep.

**Michael Flynn:** So, why don't we open each one of these up? Why don't Let's get to the bottom here. We'll give We'll check on your Claude again.

**Taha Raja:** I'm waiting for you.

**Michael Flynn:** Make sure he's not So is that the prompt that you gave it that you just gave him?

### **00:45:04** {#00:45:04}

**Michael Flynn:** Yes. Okay. So the bottom one obviously is specific to today. In fact, I took out the we are in the room part. Okay. Because I just said let's just have something consistent. Yeah. So why don't we open the folder and why don't we look at these new MD files and see what they say. So it should be the assessment.

**Taha Raja:** Yep. And it should be right here in this folder, I think. So let's try the net playbook. I guess that's

**Michael Flynn:** First

**Taha Raja:** knowledge for assessment work that a client said is not the same as knowing what good looks like for that process. This one is that second thing the back. So this

**Michael Flynn:** something that we can update

**Imran Shabbir:** And when we tell Claude something during an interview process that hey

**Taha Raja:** is

**Michael Flynn:** and

**Imran Shabbir:** best practice is to use

**Michael Flynn:** customer deposit. In this scenario,

**Imran Shabbir:** um

**Michael Flynn:** we can tell it to write that back to the playbook so that it

### **00:46:16**

**Taha Raja:** we can basically teach Claude more about that suite.

**Michael Flynn:** now we would

**Imran Shabbir:** so that it knows what to look and and

**Michael Flynn:** suggest as far as configurations and stuff like that.

**Imran Shabbir:** what

**Michael Flynn:** Yes. I was curious if it automatically put anything else in or if it's only got to cache

**Imran Shabbir:** Few

**Michael Flynn:** process. I don't know if I love this just because it's very

**Imran Shabbir:** minute

**Taha Raja:** What? It's not it's not bad to have.

**Imran Shabbir:** manual.

**Taha Raja:** I just don't know how realistic it is to keep it maintained and to make a true knowledge.

**Michael Flynn:** So what

**Taha Raja:** What is weight revenue recognition cash matching and

**Michael Flynn:** we

**Taha Raja:** settlements highly they are high like they're important easy to small. So we'll see how this comes out. Um Oh,

**Michael Flynn:** how much other stuff.

**Taha Raja:** I see what you're saying.

**Imran Shabbir:** Correct.

**Taha Raja:** So,

**Imran Shabbir:** Cash magic payouts are are high priority or high

**Michael Flynn:** Yeah. No, it

### **00:47:29**

**Imran Shabbir:** impact.

**Michael Flynn:** is

**Taha Raja:** it is inferring that from our conversation. I think how this something may probably need a little more work on.

**Michael Flynn:** document gets updated is is a question.

**Taha Raja:** I'm curious. Can we see what other points I put in here? for the triple. The Netswe playbook is as we

**Imran Shabbir:** Exactly what again? So this is basically a knowledge base.

**Taha Raja:** interact act with it and we can create this document the sprint document or is well to verify the sprint document against so like let's say didn't

**Michael Flynn:** Tell Um

**Taha Raja:** explicit that hey you should use a customer deposit in your um sales sales order process this would say hey this sounds like they need a customer deposit in

**Michael Flynn:** but

**Taha Raja:** here let's surface that because it would use this this skill is this a skill or this

**Imran Shabbir:** Mark

**Taha Raja:** is called on demand And as part of a there's a skill that runs

**Imran Shabbir:** down.

**Taha Raja:** like a quality check and it references the smart.

### **00:48:37** {#00:48:37}

**Taha Raja:** Perfect. Okay, that's great.

**Michael Flynn:** my concern is keeping this thing like at

**Taha Raja:** Right size without it getting too bloated and like we have there's a lot up here.

**Michael Flynn:** the

**Taha Raja:** Like how does that all get into a document?

**Michael Flynn:** stay relevant and stay relevant.

**Taha Raja:** Yeah.

**Michael Flynn:** So, I want to think about this a little bit more. And is it safer

**Imran Shabbir:** instead of building our own next week playbook and again I'm trying to Understand?

**Michael Flynn:** to

**Taha Raja:** difference between the playbook and it always referencing Oracle's knowledge base to verate. Yeah. So example,

**Michael Flynn:** Well, let's stick with

**Taha Raja:** right? We would consider that a best practice.

**Michael Flynn:** the

**Taha Raja:** You could loop through Netswuite.

**Imran Shabbir:** It's in the documentation all day and it's never going to say you should have a customer

**Taha Raja:** We might say you can have a customer deposit.

**Imran Shabbir:** deposit.

**Taha Raja:** It'll tell you what a customer deposit is, but there's nothing that's going to explicitly say, "Hey, when you're

### **00:49:37**

**Michael Flynn:** uh child fighting

**Taha Raja:** doing

**Imran Shabbir:** customer.

**Michael Flynn:** great

**Imran Shabbir:** So you're the bloating here would would cause excessive use of tokens to go back and forth and finish reading all these documents. Good thing is it only calls

**Taha Raja:** when it needs it." Yeah. But even if it let's say if it's just wanting to understand a best practice, it has to go through the entire file. Yes. So an additional instruction would be to have the MD file have top general topics like even as general as order to cash procure pay and say go to that section only if it's referencing that issue. Yes.

**Michael Flynn:** and make it more efficient. And this is where I

**Taha Raja:** Again another area where maybe a shot can probably Yes.

**Michael Flynn:** think

**Taha Raja:** He he he know he talked about this. Yeah, my interview is our new AI guy. Who's that? What's his name?

**Michael Flynn:** I right up.

**Taha Raja:** I'm gonna make a really bad mistake. Again,

**Michael Flynn:** Sure.

### **00:50:36** {#00:50:36}

**Taha Raja:** every time I look at it, I'm not even going to say for the recording what I see, but something about a hat. Yeah.

**Imran Shabbir:** Yeah. So he he he

**Taha Raja:** was uh we interviewed a bunch of people and part of the interview was homework we gave it of what we want to accomplish and they have to come up with a did to us as part of the

**Michael Flynn:** Design and present it.

**Taha Raja:** interview And uh when they this guy was I mean do you have that recorded? I actually haven't watched. I do have it recorded. Maybe we have some time. I mean he was like on like he was he was sharing the workflows or he obviously used AI. He told he was upfront about it. But he was able to explain it in a very clear way as opposed to other candidates which didn't even know what AI had created in some cases. Yeah. Where is he based at? Out of India. Yeah.

**Imran Shabbir:** Yeah,

### **00:51:31** {#00:51:31}

**Michael Flynn:** in the

**Taha Raja:** Yeah, originally we were thinking of going India this week and decided like we just lost

**Michael Flynn:** fall.

**Imran Shabbir:** like was just

**Taha Raja:** Shiva. We just haven't got this guy on boarded so it didn't make sense to go.

**Michael Flynn:** Laptop just exploded. So, it did.

**Taha Raja:** He just said he's been dealing with a broken laptop and I said buy him this laptop. Yeah. Oh, I told him if he needs us to do something like can't deal with.

**Michael Flynn:** So, okay. So, going back to this document.

**Imran Shabbir:** But this is very shinasty specific,

**Michael Flynn:** Um,

**Imran Shabbir:** right? How so it really shouldn't be.

**Taha Raja:** I mean these should be

**Imran Shabbir:** What belongs in here at least is general principles that PowerCloud believes are true

**Taha Raja:** gen.

**Imran Shabbir:** across the board based on what? Based on us maintaining this document. Well, to be fair, it probably is a little bit shiny based

**Taha Raja:** It's the one customer you use to build it.

### **00:52:27**

**Imran Shabbir:** because

**Taha Raja:** So it should learn our different engagements. Oh, so it's because it's referencing Nimbus.

**Imran Shabbir:** yeah, then a Tik Tok specific shiny thing. Yes. So, I think we probably need to tweak this part and

**Taha Raja:** keep and be a little bit more careful about what shows up in here. Um, and this needs to be something that learns or maybe the answer is that it interviews us when we have some back and forth and say, is this something that belongs in our general knowledge base? Yeah. So, so, so if I'm understanding it right, there's a full oracle

**Imran Shabbir:** database which has a lot of answers to questions. But then

**Taha Raja:** always solutioning,

**Imran Shabbir:** there's

**Taha Raja:** right? Which is not there are five answers to the same

**Michael Flynn:** That's where we come in.

**Taha Raja:** problem.

**Imran Shabbir:** less practice comes into play,

**Michael Flynn:** That's what this document will That's what this

**Imran Shabbir:** right?

**Taha Raja:** Whether it accurately does it is a question,

**Michael Flynn:** document

**Taha Raja:** but that's what the intention is here.

### **00:53:30**

**Taha Raja:** Yeah. Yeah, but then this document needs to be like pretty.

**Michael Flynn:** extensive

**Taha Raja:** No, but that's why I mention mentioned that you know whether it means that the document has markers in it that allows the AI to go to that specific section for a specific issue so that it's not having to go through the entire document all the time. It like see those MD file has has titles and stuff like that. So it can easily just quickly go to that section and just read that section again. Yeah. If you see all these pounds and stars, Those actually have specific formatting. Yes. Behind them. If you open this in something that is built to read an MD,

**Michael Flynn:** behind.

**Taha Raja:** it will make some of those bold, some of those will turn into bullets, some of those will turn into titles. There's actual they're not random. There's actually meaning.

**Michael Flynn:** Show me a word.

**Taha Raja:** So uh you know that that's the thing that uh I was going to suggest as a potential but again this AI engineer will tell us it could even that there is like subs master file and there's other I mean there's probably multiple ways to do it that I I don't know what's the most efficient to reduce our token usage but I feel like you're right like that

### **00:54:42**

**Imran Shabbir:** and to speed up the process

**Taha Raja:** seems like doesn't

**Imran Shabbir:** able to do Yeah.

**Michael Flynn:** How do you how do you periodically so we're talking about how does how does an AI engineer make it more

**Imran Shabbir:** Yeah.

**Taha Raja:** mean

**Michael Flynn:** efficient and how it gets read but long term how do you manage and make sure that it stays current and relevant and because obviously you got to solve every single problem right you're trying to just hit these key areas that we so effective think are truths, right? So there is a in his design he had a feedback loop. So what happens is that when the engineer says something and does

**Taha Raja:** something that feedback loop learns and puts it in a database and then there's a

**Michael Flynn:** that runs on the back end that adds to it.

**Taha Raja:** process that that's probably going

**Michael Flynn:** So there is a whole process

**Imran Shabbir:** like that. Yeah. Yeah.

**Michael Flynn:** like into a

**Taha Raja:** to be the best air because it's not feasible for me to just download my

### **00:55:38** {#00:55:38}

**Michael Flynn:** text document. Yeah. Because I mean because that's literally how every knowledge base starts. Right. And then years later, don't use that anymore. Look at what Sweet Answers used to be. Sweet. Yeah. It just had garbage in it a lot of times. Yeah. So, I want to So, I think we can Sounds like he's got some great ideas. I've got some ideas about maybe like a separate pro like maybe a feedback loop that runs outside the context of a project that just listens to every recording and looks at every session we've done and pulls things out and said should this go into this should this and there's like a semianual kind of going back in time even right yeah because there just we have all that information

**Taha Raja:** Yeah, recordings I mean back to so far but even even like docu even if you want to go back to home field. Yes, there are some documents it might not be as indepth or as but there's value there probably.

### **00:56:35** {#00:56:35}

**Taha Raja:** Yeah. Oh yeah. Yeah yeah yeah. Or even chats. Yeah. Read the chat channel. Yes. Because if you guys talked about how to handle a wholesale transfer process, you know, s\*\*\* like that, you'd find it. No, this is this is this is the key, right? It's it's like we need to leverage this to

**Michael Flynn:** Because one of the hardest things that I know Mike and I have struggled is how do we quickly Three. Take all this knowledge that has developed over time and synthesize it into

**Imran Shabbir:** lives,

**Taha Raja:** information that can be utilizations,

**Imran Shabbir:** right? Yeah. Other

**Michael Flynn:** useful.

**Imran Shabbir:** people

**Taha Raja:** but I if there was a way for me to interact with something and if something similar comes up, hey,

**Imran Shabbir:** existed at homefield five years ago.

**Taha Raja:** this problem

**Imran Shabbir:** Yeah. You know, When it

**Michael Flynn:** The challenges we had when Santos was working with us was hey how can we make a library of every script that we've written so that we're not reinventing the to a good

### **00:57:30** {#00:57:30}

**Taha Raja:** wheel every time. Y and he had we never

**Michael Flynn:** solution.

**Taha Raja:** got without

**Michael Flynn:** This type of

**Imran Shabbir:** allows us to quickly develop that.

**Taha Raja:** spending a lot of horsepower and hours. The biggest barrier was time effort it would take to do this thing.

**Michael Flynn:** work.

**Taha Raja:** It would because it would help me like if I went in if I went into whatever the cloud code and I was trying to come up with a process for to solve a problem at a customer. Yeah. And I had there was and this was smart enough to come back and say, "Hey, we've already done this and here's what we did without me having to ask." That's what it

**Michael Flynn:** Very good point and it's a data point.

**Taha Raja:** is.

**Imran Shabbir:** That's a very recording because one of the things I want to do is out

**Michael Flynn:** So you know it's good that we're talking days is come

**Imran Shabbir:** of the three four

**Michael Flynn:** up with a document that we share with the engineer that says hey here are some things we're talking about and of a starting point for this tool.

### **00:58:21**

**Michael Flynn:** Okay, let's

**Taha Raja:** Oh, this thing is still working.

**Michael Flynn:** um

**Taha Raja:** This is still working. So, let's take a look at Is that right? Let's take a look at some of those other new MD files that got created and and the skill.

**Michael Flynn:** do you want to pop back into that folder structure? Uh so we can close this one. I think we understand what this is. We don't have to read every single

**Taha Raja:** I mean process area is one another way to you know at least break down it you know if it's order to cash don't look into procure bay section so

**Imran Shabbir:** Which other the let's look uh there's a writing one right let's look

**Michael Flynn:** Can you get open in Google Docs?

**Imran Shabbir:** writing

**Michael Flynn:** Let's see if that gets the formatting for us. I think it does because I

**Taha Raja:** open the question. It's a little easier to

**Imran Shabbir:** no m dashes anywhere

**Taha Raja:** read. We don't have to read through the whole thing,

### **00:59:26** {#00:59:26}

**Imran Shabbir:** Let's just get have every client facing document and deck.

**Taha Raja:** but like

**Imran Shabbir:** How every

**Michael Flynn:** Client faces document deck needs read this before drafting the assessment of the deck for the onsite one pager. The rapid assessment scale and bi both point here. So the voice is the same regardless of who prompted the

**Taha Raja:** The through line,

**Michael Flynn:** run.

**Taha Raja:** a burned client wants brass ax, not a novel. So I heard that loud and clear.

**Imran Shabbir:** read this. They have done a pre-sale call, a kickoff, and a discovery. They are passed.

**Taha Raja:** Pleasant Please tell them what is wrong and what we will do about it in as few words as it honestly takes. That actually sounds like something's

**Imran Shabbir:** after the press. Yeah, I don't think anyone

**Michael Flynn:** Trying to use the word pleasantries.

**Imran Shabbir:** else

**Taha Raja:** loss when you were in.

**Imran Shabbir:** does afternoon drive

**Taha Raja:** So there's a guy who radio in Boston and

**Imran Shabbir:** like callers ask him

**Taha Raja:** his least favorite thing is when segment with

### **01:00:36** {#01:00:36}

**Imran Shabbir:** how he's doing or something like that. So they start again get

**Taha Raja:** us getting calls now like no pleasantries

**Imran Shabbir:** right to the

**Taha Raja:** just

**Imran Shabbir:** point

**Michael Flynn:** This is all the conversation we had

**Taha Raja:** right what was what was expected like

**Michael Flynn:** yesterday.

**Imran Shabbir:** what I call

**Taha Raja:** visits over here the one

**Imran Shabbir:** it

**Michael Flynn:** Forum section research the client's public website. First this

**Taha Raja:** Oh,

**Imran Shabbir:** built from it.

**Michael Flynn:** section

**Imran Shabbir:** It's required not optional. The ship shines assessment was the ex

**Michael Flynn:** exemplar of what good looks like here. That was a section is it

**Taha Raja:** that's what

**Michael Flynn:** was actually the second section of that document,

**Taha Raja:** China

**Michael Flynn:** right? Yeah. Correct. Yeah. body process. So the

**Taha Raja:** Good thing is we're these are all these MD files, right? This is plain text. You don't have to know code or anything like that. We can change these instructions as needed.

### **01:01:39** {#01:01:39}

**Taha Raja:** We can retype things in

**Imran Shabbir:** Um,

**Michael Flynn:** So basically what

**Imran Shabbir:** don't don't don't say what we couldn't verify and why.

**Michael Flynn:** this

**Imran Shabbir:** Leave that in the internal. We're still capturing it. We're still looking at like they said this we but we don't have to put

**Taha Raja:** saw that um after every single point or that got brought up, Right. That created a lot of noise.

**Imran Shabbir:** that.

**Michael Flynn:** Okay.

**Taha Raja:** So shy was a good example that we think

**Imran Shabbir:** We built this from

**Taha Raja:** um I have I will have a question for um the developer like should this reference China see so much but maybe the answer is yes because that's the example doc we provided that's an example it can go and see what decisions were made in the past and not repeat them. But maybe no, maybe there's a better way to do this with more generic instruction. that takes less look up and referencing. Um, one thing, yeah, I was just gonna say, would it make do you think it would be any better if we used

### **01:03:09** {#01:03:09}

**Imran Shabbir:** or worse if we

**Taha Raja:** say five to

**Michael Flynn:** existing assessments and say,

**Taha Raja:** seven

**Michael Flynn:** "Okay, instead of using

**Imran Shabbir:** use all of these and come up with the best of all.

**Michael Flynn:** just

**Imran Shabbir:** I absolutely think that would be which I think it'll do as as it naturally

**Taha Raja:** progresses and we use it? Yes. If we have a handful that we can use up front, why not? Sorry. Yeah. So on a similar note,

**Imran Shabbir:** I I think there should be

**Taha Raja:** um you can up for

**Imran Shabbir:** two

**Taha Raja:** discussion uh rescue versus very different

**Imran Shabbir:** brand new implementation. Yeah.

**Taha Raja:** conversations, different questions, different approach.

**Imran Shabbir:** Or designing than solutioning.

**Taha Raja:** It's more or just implementing

**Imran Shabbir:** Yes. Right.

**Taha Raja:** it,

**Imran Shabbir:** Which is much quicker.

**Taha Raja:** right? Should be much quicker, ready to go. So yeah, if we come up with one good and come to this

**Imran Shabbir:** You can just reuse it for the Well,

### **01:04:05**

**Taha Raja:** week

**Imran Shabbir:** this is implementation. This is specific for assessments like we'll just call them rapid assessments, right? Not a new install,

**Michael Flynn:** You probably needed

**Taha Raja:** version of this that probably actually needs to be two complete paths.

**Michael Flynn:** implementation.

**Taha Raja:** That's what I'm saying. You have a skill for assessment. So this is in there. Yeah.

**Imran Shabbir:** and I

**Michael Flynn:** Could be copied across.

**Taha Raja:** So this is a question I always

**Imran Shabbir:** think

**Taha Raja:** get. Rapid for me rapid assessment is

**Imran Shabbir:** both I think retrofit me went on site called rapid assessment sh calling it rapid assessment RM all of these have been rapid assessment in high definition. I've seen you Steve some people when you use the word rapid assessment you refer to rescue missions more. Yeah. So what would you refer 44 Pro as a new install? or I would I would use I use the word implementation but our report still says rapid assessment or sprint document shouldn't uh us

### **01:05:06** {#01:05:06}

**Michael Flynn:** usually usually we produce a statement of work out of implementation project. Okay. Maybe I'm not aware of

**Imran Shabbir:** and I have I use rapid assessment for all these engagements new or rescue. Yeah. Yeah. I think we're just trying to

**Michael Flynn:** terms this process and yeah the non-implementations in my experience can be all over the board. It can be that like you know you look at temperaments who's been you know they got they got implemented but their issues are so prolific they hit kind of all the key implementation areas whereas some could be really really specific like um like bomb party that wants to implement or you know somebody else who wants to implement a tax and they want our assistance at managing that. I mean they can be very uh very very focused or very broad. Every project is different, right? Yeah.

**Imran Shabbir:** mentation is still a sound standardization kind of. You start off with basics of chart

**Michael Flynn:** customers, right? Yeah.

**Imran Shabbir:** accounts.

### **01:06:07**

**Michael Flynn:** And and I think one of our goals is to try to standardize the implementation a little bit.

**Imran Shabbir:** Definitely. Yeah. Um, fast is what we're

**Michael Flynn:** for we're actually hoping for and again we haven't got to the actual executing portion of AI yet which isn't going to be a really important one. We've barely even tried it really other I mean we've done it with scripts and customs and stuff but as far as using a blank account and getting this thing set we haven't even tried it yet. Um should I just ignore this one?

**Imran Shabbir:** Yeah.

**Michael Flynn:** Sorry.

**Imran Shabbir:** Oh. Um,

**Michael Flynn:** Let's read let's read it out loud for the transcript for

**Imran Shabbir:** I don't think it's relevant to the report at all.

**Michael Flynn:** the

**Imran Shabbir:** The transcripts show conflicting engagement

**Michael Flynn:** uh oh um let's give it other let's say

**Imran Shabbir:** this one up.

**Michael Flynn:** ignore

**Imran Shabbir:** Yeah. Let's say put a placeholder. quite a place.

**Michael Flynn:** lo should always be established by a this isn't ane

### **01:07:16** {#01:07:16}

**Imran Shabbir:** This is something between Anderson Frank and us. Oh, okay. Um Oh, this is the the budget for the assessment.

**Michael Flynn:** Oh,

**Imran Shabbir:** Yeah,

**Michael Flynn:** I would say say ignore this.

**Imran Shabbir:** the assessment is complete.

**Michael Flynn:** The time hours of the assessment are irrelevant at this point, but give it enough that it can maybe learn. I don't even know what it's asking.

**Imran Shabbir:** Uh I would say this related to the assessment which has been

**Michael Flynn:** These hours are

**Imran Shabbir:** completed

**Michael Flynn:** specific.

**Imran Shabbir:** not right this is like whatever the billing

**Michael Flynn:** It's not relevant to this report,

**Imran Shabbir:** or nowhere in our what it means to reflect.

**Michael Flynn:** right?

**Imran Shabbir:** Yeah.

**Michael Flynn:** Well, the following notes state power rate from Frank

**Imran Shabbir:** ignore not in RF4. Rihanna describe an AI tool trans. Yeah, she she kept saying cloud. She was referring the plot. Oh,

**Michael Flynn:** What is this tool?

**Imran Shabbir:** concrete. It's clawed. It's something else.

### **01:08:55** {#01:08:55}

**Imran Shabbir:** It's clawed. Yes.

**Michael Flynn:** um these truths that we're trying to establish, Mike, like for example that that first fundamental one about, you know, using using deposits with sales orders. Yeah. Um are all of these conditional? I mean, they can be. Yeah. I mean, I I think they require context. Yeah. because there is like that is not a fundamental truth necessarily. It does, right? Very common truth, but so building these things,

**Imran Shabbir:** like just asking

**Michael Flynn:** right?

**Imran Shabbir:** like

**Michael Flynn:** And the truth is it's not you should 100% of the time use a customer deposit with ecom integration, the front end of that says if you are charging a customer at checkout, you should use which almost everybody is, but not literally. So does that

**Imran Shabbir:** because on in an ecom thing like you're very rarely going to have to go back and

**Michael Flynn:** change?

**Imran Shabbir:** pay once it's been fulfilled. So, but they they can authorize upfront. Yes.

### **01:10:10** {#01:10:10}

**Imran Shabbir:** And not capture till fulfillment. So, that to me is the change. That's the difference. So, they're always going to ask me for my my information. Correct. So, the customer you don't know the difference. Like you don't most people don't even understand that there is a difference.

**Michael Flynn:** Like so Amazon does not Amazon a and captures

**Imran Shabbir:** They

**Michael Flynn:** they do not capture your funds until they ship.

**Imran Shabbir:** don't

**Michael Flynn:** Um but you would never know that like they ship so fast. didn't really know it because what like

**Imran Shabbir:** I think I noticed when with the Uber Eats yesterday. Gotcha. I didn't get the Venmo charge until it came.

**Michael Flynn:** actually

**Imran Shabbir:** M so yeah those are um so that's the that's the answer in that case right you you're right you're nobody's

**Michael Flynn:** we're going to invoice. So what it actually is is an off capture. So if you're authorizing up front capturing your fulfillment, that means you don't want a deposit.

### **01:11:05**

**Michael Flynn:** A deposit. In fact, even if you have Netswuite credit card processing integrated, you can do the same thing. If you put the credit card number on the sales order, you save the sales order, Netswuite authorizes. You run the billing action to create a cash sale. Netswuite captures versus you could go to a customer deposit and you would capture instantly. and then then you would end up just invoicing and and clearing the invoice instead of cash sale. So basically with that in that scenario my suggestion is always if the technology and the integration allows for it follow what is happening in the real world so that your because cash application and revenue are both general ledger posting events but they don't necessarily happen at the same time. So, it's always going to be easier to reconcile your bank statements. if you post them at the correct time. So, but okay. But but again, would all of this information exist somewhere in Oracle database or do you think this should be No, just that's a combination that is a combination of business knowledge plus the knowledge of how Netswuite works.

### **01:12:22** {#01:12:22}

**Michael Flynn:** Netswuite would have the Netswuite would have the documentation of if you put a if you put a payment method on the sales order, it will cash sale and it you know it won't it will authorize and then capture later. It won't have the part where this is why you should do that or when you should do that. Right? So the why most often won't be in general netswuite documentation, right? That should that's the kind of thing that belongs in our playbook and and just because I haven't done it manually the way to change that in the UI and

**Imran Shabbir:** is don't put the payment method on the order and create a

**Michael Flynn:** we and that'll just auto it's

**Imran Shabbir:** deposit.

**Michael Flynn:** essentially the same thing as what you would do if you wanted to a capture in Shopify. So you if you have an integrated payment processor, you you put the payment method in and actually if you put any payment method on a sales order, it goes down the cash sale route. But to actually generate a O, you would use your integrated payment method on the sales order.

### **01:13:35**

**Michael Flynn:** But we just don't run into this very much anymore. It used to be way more common, I feel like. But that's why I say just never

**Imran Shabbir:** It's never come up. It's always been a shot. So if you have something like a cyber source

**Michael Flynn:** World Pay in that suite. You put the credit card information on the sales letter. Click save. That does an authorization. Yeah. And then when you run your billing action, it will create a cash sale and the cash sale will do a capture. Yeah, that's like I said, I just want to confirm that. Yeah. Just bring this up because some of these can be kind of slippery when you start saying what is it what is a truth impact or Exactly. The and the truth needs both sides. It needs the when and the why, the context and then the fact

**Imran Shabbir:** Bottom line I think right if we don't if we zoom out of this

**Michael Flynn:** that

### **01:14:23** {#01:14:23}

**Imran Shabbir:** one specific issue idea is I think build the knowledge base right based on 100 projects Mike Taha everyone has worked on so instead of me asking Taha everyone how to do it Mike how to do it this database should at least give me step one two three Still if I get stuck then maybe I reach out. Yeah. As long as as long as I get

**Michael Flynn:** And there's some mechanism and again this may be possible now with AI and it was never possible in the past because again what happened knowledge bases is over time they get filled with garbage or they have tons of stuff in there that's no longer relevant and that is oh well they don't even have that feature anymore or they completely change that. And the and all those kinds of things. Yeah, I mean there's some good points there like you know simple ones like I'm sure somebody had a workaround for vendor prepayment before Netswuite launched vendor prepayment. Yeah, exactly. The simplest little thing in net check box

**Imran Shabbir:** solves a ton of problems.

### **01:15:17** {#01:15:17}

**Michael Flynn:** now

**Imran Shabbir:** They don't use vendor prepayments. They do some other work around. Yeah. Yeah. The Senate remains didn't exist.

**Taha Raja:** five years ago.

**Michael Flynn:** five years ago.

**Taha Raja:** Yeah.

**Michael Flynn:** Yeah. How did you like quant inventory before?

**Taha Raja:** Or how did you or even So we talked about taking

**Michael Flynn:** Yeah. or even so we talked about taking a deposit from a sales order.

**Taha Raja:** a deposit from a sales

**Michael Flynn:** When I started with Netswuite,

**Taha Raja:** order.

**Michael Flynn:** there was no linkage between a deposit and a sales order. You could only put a deposit on a customer record and you would have to manually buy

**Imran Shabbir:** You could die.

**Michael Flynn:** it.

**Imran Shabbir:** You certainly know.

**Taha Raja:** Launch a deposit from the sales order.

**Michael Flynn:** They launched that a month after I paid somebody to build it for me. Yeah. So I I mean I'm I'm optimistic because again with AI there's things possible now that we would have never created or

### **01:16:02** {#01:16:02}

**Taha Raja:** the first example the prepayments.

**Michael Flynn:** possible

**Imran Shabbir:** knowledge base had a workaround.

**Taha Raja:** Let's have to up make sure we

**Imran Shabbir:** Correct. We would need is no longer necessary.

**Michael Flynn:** that knowledge base and said actually

**Taha Raja:** update.

**Michael Flynn:** this look at the article documents

**Imran Shabbir:** But you don't have to because now

**Taha Raja:** You're also telling me to go

**Michael Flynn:** I can see oh it been released is

**Imran Shabbir:** 3.2 actually there solution by netu. So so the oracle document That's another I think it is only

**Michael Flynn:** massive right I I my opinion is

**Imran Shabbir:** going

**Michael Flynn:** that it only makes sense to go try to research a pro a specific problem in the Oracle database. It can't consume the or the full Oracle help center every time we

**Imran Shabbir:** cost way too much.

**Michael Flynn:** generate,

**Taha Raja:** We'd be better off just going downloading it all.

**Imran Shabbir:** And then you download it. The day you download it,

**Taha Raja:** Well,

**Imran Shabbir:** it's

**Michael Flynn:** right?

**Imran Shabbir:** it's

### **01:16:54**

**Michael Flynn:** Like there's no way we can crawl. Nobody see

**Taha Raja:** can't unless there's a way to if if

**Imran Shabbir:** orthod Tell it where to go instead of

**Taha Raja:** they

**Michael Flynn:** database has a some kind of an index or something that

**Imran Shabbir:** scanning.

**Taha Raja:** the whole thing. Well, it does, but like if we had a workound. No, but an index that an AI can use properly. You know what I'm saying? Which might I mean?

**Michael Flynn:** Yeah. But but here's the problem there, right? we have explicit instructions that say, "Oh, here's how you work around when you need to make a vendor prepayment." It would be hard for the database to it would be hard for any AI, any human to say, "Oh, should I double check to see if that's still the case or not?" Because they put it in their knowledge base, so they must think that's the right answer. It's not just going to go randomly and say, "What's new in Netswuite?" Like, it's got to be a little more directed than that.

### **01:17:46** {#01:17:46}

**Michael Flynn:** I almost wonder though

**Imran Shabbir:** If our feedback loop that we're talking about would solve If we

**Michael Flynn:** how

**Taha Raja:** of that problem. It could if we could help them.

**Imran Shabbir:** do a good enough job with it, I think it can like I've I've had this problem before. Okay. But we know now like we know the knowledge here

**Taha Raja:** that there's now a new solution and that's no longer the right option.

**Imran Shabbir:** is

**Taha Raja:** Yeah. And we interact with the system

**Michael Flynn:** And it'll update that skill or that that

**Taha Raja:** and

**Imran Shabbir:** Oh, whatever.

**Michael Flynn:** whatever document where when the

**Imran Shabbir:** In fact, maybe this should be a process that we that we

**Michael Flynn:** new release documentation comes up where

**Taha Raja:** there is a point in time

**Michael Flynn:** somebody loads that into this feedback loop and it kind of

**Imran Shabbir:** does a rein of us and say, "Hey, you used to do this. It looks like this new feature might solve that. Should we consider?" So, I I think that's a great point.

### **01:18:36**

**Imran Shabbir:** Uh incorporating new release

**Michael Flynn:** information to update these skills that we're talking about is you could have

**Taha Raja:** Then the other thing is issue came

**Michael Flynn:** some kind of time bomb, right? Last time

**Taha Raja:** up was 6 months ago.

**Michael Flynn:** this to make

**Taha Raja:** A release has come out. I

**Michael Flynn:** sure that it's there.

**Taha Raja:** need

**Michael Flynn:** There needs to be some level of intelligence on that side as well. And then of course the human loop will help solve that as well. I I just want to add in basically you have

**Imran Shabbir:** something too. Yeah. Yeah. Exactly. Recording purpose.

**Michael Flynn:** to

**Imran Shabbir:** But like I think you're right. If we do that and have

**Taha Raja:** I read,

**Imran Shabbir:** the

**Taha Raja:** you know, the the release information and feedback loop and then and

**Imran Shabbir:** we should extrapolate those changes out without waiting for somebody to go in.

**Taha Raja:** then

**Michael Flynn:** think

**Imran Shabbir:** Like if there's a process to do that release comes out today, you load the release notes in.

### **01:19:25**

**Michael Flynn:** it interviews you.

**Imran Shabbir:** Yeah.

**Michael Flynn:** Process A has now changed.

**Taha Raja:** because of a new feature in Netswuite, we should not wait for me to go in and use that or try to use that or solution next. We should basically proactively just go hey to the power cloud team. Yeah, these things have changed based on the new release in our a be aware of it.

**Imran Shabbir:** in our AI

**Taha Raja:** Yeah, I think so.

**Imran Shabbir:** process.

**Michael Flynn:** New portal maybe even exactly.

**Taha Raja:** As an update on release updates,

**Michael Flynn:** Yeah.

**Taha Raja:** whatever because tr truthfully,

**Michael Flynn:** Yeah.

**Taha Raja:** it'll be much if we're going down this road rather than having us read through the release notes from Netswuite, if nothing in our process changes, why do we care? Yeah. Yeah. you know, not why do we care? No, but if something changes in the software renewal like process of that, you know, I think at this point it's unlikely we're going to start doing software sales as as customers. Uh just not something we've ever

### **01:20:27** {#01:20:27}

**Michael Flynn:** not something I I don't think any of us feel comfortable with is,

**Taha Raja:** done.

**Michael Flynn:** you know, recurring revenue SAS model. Like we just don't know, strangely enough, since we're in that business, we don't really know how to run that business.

**Imran Shabbir:** We don't look for those customers.

**Michael Flynn:** So 200 words on that in the

**Imran Shabbir:** So if

**Michael Flynn:** release note.

**Imran Shabbir:** there's

**Michael Flynn:** I think you're right. We can kind of exclude that. There's probably a cut over period where like a feature sounds really good. We don't know if it's going to work yet and we have to say like put this in as a possible alter. alternate solution, but don't replace our best practice until we confirm it

**Taha Raja:** Another step on that topic.

**Michael Flynn:** in

**Taha Raja:** Another thing we could use that for is highlighting where our where these changes impact our customers,

**Imran Shabbir:** Yes.

**Taha Raja:** our existing that's this is a whole

**Imran Shabbir:** Yeah.

**Taha Raja:** can of worms. So I don't want to go too too far.

### **01:21:24** {#01:21:24}

**Michael Flynn:** still. It's like that's what we're doing. We're like, "Hey, you got to be you know

**Imran Shabbir:** What's

**Taha Raja:** to know where it fits your customers.

**Imran Shabbir:** changing?

**Taha Raja:** As we roll this out and roll our future stuff out, can we keep some sort of a knowledge base of every feature or function that each one of our customers is using? Yeah. Like, hey, we we detected this change. This this this changes the power cloud process. Yep. Go check look into our customer base and and see which ones are using this feature or whatever. So this has come up a lot

**Michael Flynn:** having like weird little things that like oh um Shopify changed their

**Taha Raja:** with

**Michael Flynn:** API which means we need to go and tweak the CGO setting a little bit based on those which one of our customers uses this flow that's obviously not a great process like being able to go to our tool and saying, "Hey, which one of our customers did we configure this flow for that we need to reach back out to and do some more

### **01:22:29** {#01:22:29}

**Taha Raja:** That's so do we need to review the draft ourselves

**Michael Flynn:** work

**Taha Raja:** or um so is this like this is trying to build the the assessment?

**Imran Shabbir:** on the new instructions.

**Taha Raja:** Is it coming back and asking him more questions? Yeah. So let's read let's read through what it so drafts are done as markdown. This is the LE checkpoint every hour. Let's tell it to produce the final documents and we'll update the LOE's in the it's asking three things. Um okay. Does the split match how you sequence the client? Any individual item hours look off that survey. Then the priority labels. Did I get these right? Should I just say present the document and review there? Yeah. Like let's say let's just have to present the finished documents and we'll come back. At this point, we're still really

**Michael Flynn:** focused on content and not format and all that.

**Taha Raja:** focing

**Michael Flynn:** Right. Right. Which it it

### **01:23:34** {#01:23:34}

**Imran Shabbir:** two right so it is saying I've done all of these in

**Michael Flynn:** is

**Imran Shabbir:** markdown

**Taha Raja:** and this is worthwhile. It's suggesting that we look at the text version of

**Imran Shabbir:** these documents create

**Taha Raja:** make the changes that we want in those documents before it puts together the nice polished finished version. Yeah. Yeah. Which probably in the real world actually makes sense. I don't Yeah. just I just I asked

**Michael Flynn:** Because you know all these little format adding, you know, conversations that have happened. Um, just curious from that standpoint, I think the best ways to to present the data the uh thinking of

**Taha Raja:** the and the the markdown files that's like a working a working doc that you're able to look at

**Michael Flynn:** the

**Taha Raja:** and go okay yeah this is this is basically what I want I can make some adjustments in that file and then saying, "Hey, I've made my adjustments. Now go render the good the nice stuff." Yeah. I mean,

**Imran Shabbir:** a designer or something,

### **01:24:33**

**Taha Raja:** you would think if you were like together a nice

**Imran Shabbir:** that's what you would want, right? Like you don't want to

**Taha Raja:** PowerPoint and have and then have to go through and change it,

**Imran Shabbir:** put

**Taha Raja:** you'd rather say, "Hey, edit my source text document once once I once

**Imran Shabbir:** paint this thing and polish it up.

**Taha Raja:** I

**Imran Shabbir:** It's done.

**Michael Flynn:** So, let's fix everything in the in the notes. Yeah, you're essentially refining your notes. You're you're refining the

**Taha Raja:** Okay. Before you your notes break out

**Michael Flynn:** cont formatting for

**Taha Raja:** uh

**Michael Flynn:** example of how you want to present level of effort beyond an obvious here's a here's the description of what the cate let's while it's reading let's go look if you want to scroll up and run hyperlinks to okay formatted document you

**Taha Raja:** Or are there certain elements like that that until it produces a

**Michael Flynn:** won't it might just say five hours but then if We produce the front-facing document. It's

**Taha Raja:** bold and has like estimated LOE blah blah blah.

### **01:25:28** {#01:25:28}

**Michael Flynn:** like

**Taha Raja:** You know what I mean? Let's do the assess. Let's do the assessment draft. What is this third one? I didn't see this yesterday. We did do it, but we didn't. Oh, so the execution plan we're going to use in the next step

**Imran Shabbir:** All

**Michael Flynn:** ultimately what

**Imran Shabbir:** the

**Taha Raja:** to start creating SDF customers we are not going to

**Michael Flynn:** push that we can actually push into China's account.

**Taha Raja:** do because they haven't actually engaged us yet. So that's right. China is engaged. Are they engaged? We're doing rapid. We finished. Well, in theory, we could just say execute the plan and we'll just go fix everything at China and we'll be done with it would be interesting to see what

**Michael Flynn:** But it would

**Taha Raja:** the SDF comes back with before we push it in.

**Michael Flynn:** be

**Taha Raja:** So, it's it's not it's meant to take a second step and say, "Hey, look at this execution plan and let's break up SD and create XDFs out of it." Um,

### **01:26:30** {#01:26:30}

**Taha Raja:** yeah, but we absolutely should

**Michael Flynn:** Yeah, absolutely. Absolutely. So while it's writing the fancy version, this is this is what we can read right now. So you can see there's no form to it.

**Imran Shabbir:** basic

**Michael Flynn:** It's not super polished,

**Imran Shabbir:** formatting.

**Michael Flynn:** but let's see. So it's a two-step process. So yeah, what it does is it writes everything

**Imran Shabbir:** Mark down first and then it basically

**Michael Flynn:** in

**Imran Shabbir:** dis

**Taha Raja:** designed a nice document around that markdown. It suggestion was that we read the markdown first and make changes. So, Once it does the PDFing and stuff, it doesn't have to go back. That's great. We told it just go ahead, but while it's going ahead, we're going to read the markdown. Okay, that's a good good interim step, too.

**Michael Flynn:** prepare.

**Taha Raja:** So,

**Michael Flynn:** Make this a little bit bigger. Sorry.

**Imran Shabbir:** consulting.

**Taha Raja:** good. used to be like the

**Michael Flynn:** You used to always have these crazy resolutions.

### **01:27:28**

**Michael Flynn:** That's right. Close.

**Taha Raja:** left. That might make it bigger.

**Michael Flynn:** Not really. Let me see if it's already

**Taha Raja:** It Well, so it definitely exists in the folder structure.

**Michael Flynn:** download.

**Taha Raja:** You can definitely open it in. It doesn't matter. Let's go. Let's move forward, guys. Everybody's Everybody's able to read it. That's fine. I can make do.

**Michael Flynn:** See where it is.

**Taha Raja:** So it should be in

**Michael Flynn:** It should be in the redo and then in the deliverables or should it have been working?

**Taha Raja:** the

**Michael Flynn:** I've been working the

**Taha Raja:** version.

**Imran Shabbir:** working.

**Taha Raja:** Yeah.

**Michael Flynn:** draft. Okay, perfect. So, I hope it cleans up that top a little bit. I don't really care about the engagement type and stuff like that as far as presenting to the customer. I'm hoping that's just information, but we'll see. Executive summary. So, this should be good. China

**Imran Shabbir:** More heavily testified.

### **01:28:40** {#01:28:40}

**Michael Flynn:** runs

**Taha Raja:** What is unusual about it? Um, let's maybe catch

**Imran Shabbir:** That's

**Michael Flynn:** well, it we know it's heavily customized. We know they built their own W. We know it doesn't have one world yet. Okay. I hate using advers like these because

**Taha Raja:** Oh, it's an opinion. Yeah, I'll also take this out the very first sentence if there because somebody might even take it as a

**Michael Flynn:** What's unusual about it?

**Taha Raja:** negative.

**Michael Flynn:** Yeah, from my own experience back when we were like adverbs are the worst thing when you're doing consulting. Does

**Taha Raja:** Means you're not objective.

**Michael Flynn:** that

**Taha Raja:** Eight years of accumulative development supporting e-commerce wholesale four

**Michael Flynn:** retail kiosk locations and Amazon

**Taha Raja:** owned fulfilled from the Denver

**Michael Flynn:** also

**Taha Raja:** warehouse maturity is also the story of this assessment over 200 active custom scripts three parallel build processing tools that's been extended piece

**Michael Flynn:** reflect a system that was built

**Taha Raja:** by piece to keep pace with rapid growth not probably the same feed

### **01:29:41**

**Michael Flynn:** carelessly? know it's positive, the result is real and it's fixable. A handful of foundational cleanups. So, so one, yeah, I mean, one feedback to think about is stop using adverbs. Stop making opinion.

**Taha Raja:** of what the system is. Just state the fact. Yeah. Yeah. And no time.

**Michael Flynn:** No judgments, right? Yeah. Yeah. Remove the judgments. This was our remote home. All right. Four things that sit out high. Y down a little bit here. We'll see if it chang.

**Imran Shabbir:** changes. This

**Michael Flynn:** Yeah. Even if it's spot on. Yeah. And especially when you're dealing with a developer who spent all that time doing it and he's a key supporter of us right

**Imran Shabbir:** people

**Michael Flynn:** now. Like where does it get into the company? Yeah. It's interesting that after all our thing and still put this into like to me

**Taha Raja:** This should be the start.

### **01:30:40** {#01:30:40}

**Taha Raja:** Yeah, it should be.

**Michael Flynn:** this.

**Taha Raja:** And let's see once it goes through the check after it does it, maybe it picks up on that feedback from yesterday and and does move

**Michael Flynn:** But in my mind,

**Taha Raja:** that.

**Michael Flynn:** this business overview should be

**Taha Raja:** Right. Fair. I do I don't disagree at all. But do we think that that is beneficial

**Imran Shabbir:** Executive summary.

**Taha Raja:** like that stuff?

**Michael Flynn:** But if you're just getting facts as a summary. Yeah. Clean up

**Taha Raja:** Yeah. But then just take it and move it below the business overview because I think that it you

**Michael Flynn:** that.

**Taha Raja:** you tell about we know about the business and here's a summary of the entire document and and the main points and then you get into the detail.

**Michael Flynn:** I think that's a good point. Yeah,

**Taha Raja:** Yeah.

**Michael Flynn:** I agree. I don't I mean I don't think this is a bad probably not the first thing you should read.

### **01:31:28** {#01:31:28}

**Michael Flynn:** Yeah. Yeah.

**Taha Raja:** And again, it could be you can just say no as well and go no.

**Michael Flynn:** What's

**Taha Raja:** This is we're just going to we're reiterating what's below

**Michael Flynn:** How do you feel about these four things being called up?

**Imran Shabbir:** the the two big ones,

**Taha Raja:** still customer deposit order process flow

**Imran Shabbir:** right? We just the

**Taha Raja:** and so it's interesting you it's missing now multiple times.

**Imran Shabbir:** the

**Taha Raja:** What is what happened in the conversation that it is not catching it? Well, let's see if it's actually missing or it just didn't put it up with the the good from the top. But but but it is important when it

**Imran Shabbir:** whether you think it should be part of the top.

**Michael Flynn:** four

**Taha Raja:** should.

**Michael Flynn:** things.

**Taha Raja:** Okay. So then that's that's a gap even if it's mentioned down the it's even

**Michael Flynn:** Yeah. Well, I mean, let's for

**Taha Raja:** mentioned and if it is at least we are one step forward.

### **01:32:20**

**Taha Raja:** Yeah. Next is how to bring it as the main issue. Also, we should if it is missing again, we might have to go to the transcripts and find the section you talked about it and

**Imran Shabbir:** a little bit about why I didn't pick that part of the

**Taha Raja:** interrogate

**Imran Shabbir:** transcript.

**Taha Raja:** um four things stood out. Are we reading all this? I still just going through the sections. Uh let's let's just go through the high

**Imran Shabbir:** High level

**Michael Flynn:** We'll skip it and run around.

**Imran Shabbir:** here.

**Taha Raja:** don't care about the estimated hours also the

**Michael Flynn:** We're gonna We know those are placeholders anyway.

**Taha Raja:** summary of the four points above business salvation. It says

**Imran Shabbir:** This this makes sense. This should be the first thing I'm reading.

**Taha Raja:** realized they started with ugly Christmas sweep about

**Michael Flynn:** Did it get that from the website? Yeah,

**Taha Raja:** it, right?

**Michael Flynn:** I don't think you actually makes sense.

**Taha Raja:** Oh, that's how they started.

### **01:33:19** {#01:33:19}

**Taha Raja:** Yeah. Which is interesting.

**Michael Flynn:** I mean, I it looks like it might have gone more than just the website, right? I'm guessing like a se blowing up because they got a segment on the Today Show probably news article somewhere

**Taha Raja:** Unless it's on there about was correct last

**Michael Flynn:** on this or something. Yeah, all of this is

**Taha Raja:** time too.

**Michael Flynn:** fine.

**Taha Raja:** Verified scale. Yeah. Like I don't know if you used the word verified but whatever. Yeah. I mean I I So we left it in there to say you know if there's a couple If there's a few key facts that we have verified, confirm that we verified them. So, let's see how often that comes up. I was going to say if this is the only block that has fine. I feel the same way or many. It's just not all over the place. Hit the second right here.

**Michael Flynn:** It is two pieces of good news to build on.

### **01:34:32** {#01:34:32}

**Michael Flynn:** Oh, no. But that's not it's it's really nothing bad.

**Taha Raja:** It's almost like parental,

**Michael Flynn:** It's like, hey, I got good news for you. It's like, what the hell? as we've covered your environment is really s\*\*\*\*\*. But I think it's fair, but it's also not like implying

**Taha Raja:** It's just like,

**Michael Flynn:** that consultative way to state

**Taha Raja:** hey, but there's a there's a

**Michael Flynn:** that without saying,

**Taha Raja:** professional.

**Michael Flynn:** "Hey, I got two." I mean, it's almost like used car salesman s\*\*\*, you know? It's like, "Hey, I got good news for you." Even

**Taha Raja:** Even if as you're presenting this, you say, "Hey, listen guys,

**Michael Flynn:** if

**Taha Raja:** the good news is Yeah. Right. Like but you can verbally you can verbally say that but putting it in a formal document I think it's a problem. Yeah. You know verbally I've

**Michael Flynn:** terms like these as well,

**Taha Raja:** used

**Michael Flynn:** it's not to say, "Yeah, but I mean, but to put it in a document, it's it's a little kind of

### **01:35:21** {#01:35:21}

**Taha Raja:** crazy. Yeah. And it keeps mentioning this as the main thing which to be honest we spent only last 15 minutes of the fourth call. Okay. I'm curious to see if it's going to clean some of this.

**Michael Flynn:** cuz some of this feels like the feedback we gave it and it's not really but points look

**Taha Raja:** Let's see. So, it's going to be the same four points from above, I think.

**Michael Flynn:** like

**Taha Raja:** Scroll through. All right, let's see if we get into the actual

**Michael Flynn:** It's Amazon settlement.

**Taha Raja:** Each item is labeled requested or identified. Never vote. I don't know what is. I mean it uh well I mean that's again something I asked it not to do. So I'm curious whether it renders this in the final document. So what is this customer deposit payment link validation

**Michael Flynn:** whe I mean

**Taha Raja:** this happened? Yeah this is one of the issue but it's on the Shopify also and Shopify is the bigger 90% of the volume so

### **01:36:43**

**Michael Flynn:** this

**Taha Raja:** you know let's see let's see if it's there. So this is that's not it. So, I'm just curious. We've we've pointed out a few things that we want to talk about. Do we need to make note of this so that we can state these things back again?

**Imran Shabbir:** and what's the process next after

**Taha Raja:** So, mostly I'm using I'm going to use the call.

**Imran Shabbir:** that?

**Taha Raja:** Okay. Um, so that's why I want to make sure out loud. Got it. Understood. Certainly. I'm gonna make you building it out. So, don't uh Yeah. subscription. So, order cash wholesale. So, it it looking like it is not going to find

**Michael Flynn:** that customer deposit again. But let's just keep going. Let's make sure it just didn't put it in a weird section. Was

**Taha Raja:** counting was there.

**Michael Flynn:** there

**Taha Raja:** What was that one about the discount?

**Michael Flynn:** allocation?

**Taha Raja:** He believes next week.

### **01:37:48** {#01:37:48}

**Michael Flynn:** Okay.

**Taha Raja:** That That's better than it said before. I didn't read the rest of it yet, but yesterday it basically said it can't. Oh,

**Imran Shabbir:** I think it gets even better and sweet.

**Taha Raja:** and and actually if they're using

**Imran Shabbir:** It mentions sweet promotions which I

**Taha Raja:** or not, Netswuite's native sweet promotions feature does support combining item

**Imran Shabbir:** don't

**Taha Raja:** level.

**Michael Flynn:** So this is referring to the Oracle

**Taha Raja:** It must be. I don't remember. We didn't talk about that.

**Michael Flynn:** documents.

**Taha Raja:** We don't use sweet promotions a lot. So, I'm guessing did you even know that? No. So, we didn't bring it up. So okay. So that is we can see a change. Yeah.

**Michael Flynn:** Um,

**Taha Raja:** This is a So we did this. It's not power discount.

**Michael Flynn:** discount

**Taha Raja:** It's So we have customization. We've tweaked power discount to do this in some places, right? Oh, we did. Have you a c a standard customer discount?

### **01:38:49** {#01:38:49}

**Taha Raja:** Like customer A always gets a 5% partner discount or something like that. Uh, no. Are you talking about for barbell?

**Imran Shabbir:** I don't think it's a standard customer discount. Now I think there are it's

**Taha Raja:** to only what discount items exist. Gotcha. And they can't edit any of the the related fields.

**Imran Shabbir:** limited

**Taha Raja:** Okay. Like because you pick a discount item, it'll populate the discount amount. You can just change that and we don't they don't want them doing that. So we have done this before for customer. So we did it for lowle. So because so for lowle we have power discount which is our product. Mhm. And we did a customization just for OLE which is a customer level discount. And those two scripts man have been conflicting for last.

**Imran Shabbir:** six months. Yeah. I don't really love

**Taha Raja:** If we can this is a scenario where personally I would hit the pause button and really talk about whether we could just use a price level whether the customer No, we did.

### **01:39:46**

**Taha Raja:** I mean we have they wanted a custom.

**Imran Shabbir:** the conversation.

**Taha Raja:** I mean for anybody who But why why did they want a custom versus using native?

**Imran Shabbir:** Sure.

**Taha Raja:** See the thing is whenever customers say that I always dig in people like what is the reason? I mean that's a different law and and so is the is the

**Imran Shabbir:** Yeah.

**Taha Raja:** conclusion here correct then? No no no no I'm referring to Llay um another client. Oh got it. Okay. We they initially used price level discounts then they used promotions which Mike also. No, I I I we don't need to I was talking about in the context but in this case it wasn't power discount configuration for customer level. It is a a custom script discount was also discussed

**Imran Shabbir:** which we have built. So that was discussed and

**Michael Flynn:** visual

**Taha Raja:** two different things. So I think come I mean sometimes people get obsessed with

**Imran Shabbir:** power

**Michael Flynn:** and they just want to show that additional discount is yeah that that is very common in Shopify because Shopify does that universally sure and that's why people get if it's not in Shopify the integration just reads it though and it should come in exactly if in party inc

### **01:40:56** {#01:40:56}

**Taha Raja:** We you want to just say that Best in the

**Michael Flynn:** always gets 10% off and we want to show it as a discount. I think that was the reason a lot of effort to just get to the place where we can just make adjustable price level. Yeah. Yeah.

**Taha Raja:** But again,

**Michael Flynn:** I think that is one GL

**Taha Raja:** yeah, but there is like if you need to record it as

**Michael Flynn:** posting discount is a valid. But if they have multiple price levels, let's say Justin Dearti has price level one and your retail is price level zero. It's still easy to show both. Yeah. on a PDF to say call into the custom field the price level zero. Oh, and next

**Taha Raja:** Next to it is your price and so you show like MSRP and then my price.

**Michael Flynn:** and

**Taha Raja:** Exactly. I mean, you know, you still can use price levels for the

**Michael Flynn:** functionality.

**Taha Raja:** same,

**Michael Flynn:** There's a PDF call two prices next to each

### **01:41:50**

**Taha Raja:** you know. Yeah. I mean, obviously it'll depend on what other requirements there are or whatever like that. if it's not just a PDF and there's some other reason and I think that there I don't know what I don't know what it would be but other posting. Yeah. Okay. But if you post so if this is a challenge you can give to the accounting team

**Michael Flynn:** It's like if you post revenue at your retail price and you sell at

**Taha Raja:** discounted price and if the discounted price is the the price you gave to the customer you can't recognize

**Michael Flynn:** a

**Taha Raja:** revenue at MSRP. That is inflating your revenue number artificially. So then what you said is not right. Like if I if you're always giving me 10% prohibited just give me that price. You don't give me a discount. Yeah. I mean I but it's more reporting purpose that how much

**Imran Shabbir:** posting. You mentioned posting.

**Taha Raja:** is suggesting is reporting capable?

### **01:42:40** {#01:42:40}

**Imran Shabbir:** You see what I So,

**Taha Raja:** Yeah.

**Imran Shabbir:** we're going down

**Taha Raja:** So it's a little bit but like I mean we've had customers who not

**Imran Shabbir:** ra

**Michael Flynn:** They want to post not discounted revenue.

**Taha Raja:** only

**Michael Flynn:** They want to post they want

**Taha Raja:** downs posted as if they're discounts.

**Michael Flynn:** Mark

**Taha Raja:** So they want to so if they say I sell this this shirt come

**Michael Flynn:** we launch this shirt. sells at $100. Do you do a promo and give me 20%? Not even a promo. If I do a permanent price change to lower it to $75, I want to record the $25 as a discount and I want to record $100 revenue because now you're inflating your revenue, top revenue number, because now they can report we did $100 million in revenue when you didn't. So even if it's a contra income account, so no, you cannot. You cannot. I I even talked this over with Hussein and and his partner at He said if you do that that is illegal.

### **01:43:41**

**Michael Flynn:** Well, because you're reporting that

**Taha Raja:** $100 million company and you really had $20 million in revenue everybody an 80% discount.

**Michael Flynn:** you're

**Taha Raja:** Exactly. So you're so

**Michael Flynn:** saying discounts really should never be posted.

**Taha Raja:** basic discount on a

**Michael Flynn:** No discount should be posted if you gave that I released a coupon for 30 days.

**Taha Raja:** specific scenario at that point

**Michael Flynn:** Yeah. Yeah.

**Taha Raja:** like

**Michael Flynn:** Got it. Right. But if you say this is general my general price and then compare it to MSRP that's

**Taha Raja:** if you if you like like Mike said if you originally launch a shirt for 100 bucks and you permanently mark it

**Michael Flynn:** you

**Taha Raja:** down to 80 and sell it to everybody for 80 right now you can't report a h 100red with a $20 disc. Yes, cuz that's your new price essentially. Yeah. Yes, that makes sense. I just I I know in the apparel

**Michael Flynn:** there are people who have chosen to do it otherwise.

### **01:44:26** {#01:44:26}

**Taha Raja:** world

**Michael Flynn:** Yeah, I know. I know.

**Taha Raja:** is the other document done yet?

**Michael Flynn:** Any

**Taha Raja:** Let's see because we've seen

**Michael Flynn:** issues with this already?

**Taha Raja:** some Let's go to

**Michael Flynn:** Okay, it looks like it is.

**Taha Raja:** the output folder.

**Michael Flynn:** Let's just read what it Let's see if it made any of our changes.

**Imran Shabbir:** Come.

**Michael Flynn:** So,

**Taha Raja:** So now this has the logo and everything.

**Imran Shabbir:** really.

**Taha Raja:** We did not put customers logo here. Uh so the the the

**Michael Flynn:** It didn't is we gave it a do you think it because we gave it a general instruction to go to the website or I think I gave it a general instruction. I didn't specifically say grab the if we don't provide the logo grab it from here.

**Imran Shabbir:** So,

**Taha Raja:** Hey for a logo,

**Imran Shabbir:** how come you still

**Taha Raja:** you know it asked for you and then you said I will go get it from Well, it didn't ask for it. It

### **01:45:34** {#01:45:34}

**Imran Shabbir:** I I was

**Michael Flynn:** watching it as it rendered live and I could see that it was looking for the logo,

**Taha Raja:** would

**Michael Flynn:** right? It was looking for a logo. So, I just I just jumped in and said, "Hey, go to the website to grab the logo." So, I will be more explicit. We'll we'll we'll give that we'll again we're in like a feedback loop right now, right? So, I think Yeah,

**Taha Raja:** Oh, so did it use that?

**Michael Flynn:** it did. Okay. So, I think this is like the mark.

**Taha Raja:** It's looking pretty much exact.

**Michael Flynn:** Pretty close or Yeah.

**Taha Raja:** So really the one thing hanging out here

**Michael Flynn:** Here is I want to go to the table and see what it did for a table and I want to see if it grabbed the customer deposit point from anywhere at all.

**Taha Raja:** It's like

**Michael Flynn:** Oh

**Taha Raja:** Okay.

**Michael Flynn:** good there. So I I don't I don't hate

**Taha Raja:** That layout because it gives to me it gives separation between tasks.

### **01:46:59** {#01:46:59}

**Michael Flynn:** You don't hate it doesn't mean you like it.

**Taha Raja:** I think well

**Michael Flynn:** You could because before we had it

**Imran Shabbir:** It's like

**Michael Flynn:** listed

**Taha Raja:** old with the hours and then the priority and notes might have been separate but I kind of do like it because it separates

**Imran Shabbir:** L

**Taha Raja:** individual tasks. So this I think we need to

**Michael Flynn:** a line on what it is we actually want and give it an explicit instruction.

**Taha Raja:** just

**Michael Flynn:** So uh help me understand exactly where is this

**Taha Raja:** in the context of the document where it breaks out the workout.

**Michael Flynn:** section.

**Taha Raja:** Oh, got it. For each work. Okay, got it.

**Michael Flynn:** So I think our I like what we said yesterday when we said like pulling the long text out of the table makes sense because the table looks jacked up a lot of times. That's actually probably the one thing I think I really liked about yesterday's where it listed all the work items in like verbose language and then below that it gave me a table of each one with the LOE.

### **01:47:56** {#01:47:56}

**Michael Flynn:** Yeah. So I maybe the right approach is that Uh so and again upward discussion here is it better from a quick remember the objective is the customer should be able to digest this quickly right so is it better to give a table first yes with issue potential resolution LOE kind of our standard traditional table and then at the bottom have each one in a verbose section so and with links in the table to say if you want more explanation you hit And you go to that the verbbo section because then the thing is the customer can

**Taha Raja:** and say I can read

**Michael Flynn:** focus on

**Taha Raja:** that even when you do your presentation you can focus on that table and then even draw the attention to the

**Michael Flynn:** that

**Taha Raja:** client saying hey by the way if you need a detailed explanation click this link on the table it'll take you to that part of the section to

**Michael Flynn:** about I don't think we can answer that question. I think we have to ask our customers. No, but I mean we have to make a decision, right?

### **01:49:00**

**Michael Flynn:** But I think we can

**Taha Raja:** produce both and ask and and use one initially,

**Michael Flynn:** initially

**Taha Raja:** right? Make a decision, but have both at our disposal and say, "Hey, find a good customer that you can ask. Can can Yeah.

**Michael Flynn:** customer helpful. Well,

**Taha Raja:** I mean you're right.

**Michael Flynn:** then that fair,

**Taha Raja:** So then it has to be what power wants to communicate

**Michael Flynn:** right? Because we can't be because otherwise it's every customer is different. But I'm saying from a human attention span.

**Taha Raja:** being standpoint with today's short or is it going to go to

**Michael Flynn:** What is a human being going to do? Is he going to read the

**Taha Raja:** the table first where he can digest what's going to happen.

**Michael Flynn:** verbose?

**Taha Raja:** Agreed. And then go down the road. Yeah. So you're you're basically saying do what we did yesterday. have the verbose and a table, but do the table first. Yes. And then the table has links to the appropriate section.

### **01:49:52** {#01:49:52}

**Taha Raja:** I think we said the links yesterday, too, but it was because I mean, Ron, what do you think about that? Yeah.

**Michael Flynn:** And I'm I'm you get stuck in here's how I like to see data. Yeah. Right. And I love I love those tables that say uh here's the number, here's the issue, here's the here's the proposed solution, and here's the LOE minimum, here's the LOE. I love that because it's giving me in a nice concise format everything I want. Um the having the verbose at the end I kind of had not thought of. Um it's almost like an appendix, right? Yeah. Yeah, that's exactly what it is. It's like an appendix. It's like, okay, you want I think there So I I mean to me it's like you decide on a direction you're going with this and saying, "Does everyone like this out of the shoot?" And then you get feedback over time, even unsolicited feedback as you're presenting new rapid assessments for new customers and they're saying, "Where is this?" You notice on them,

### **01:50:51** {#01:50:51}

**Michael Flynn:** you know, do they like the format or they question it? I I couldn't find the details or there's not enough details or whatever. And see how it goes. Imran, what are You think I think we spent like three months going through this back and forth.

**Imran Shabbir:** when you're building the

**Taha Raja:** Yeah. Um my personal preference is tabularized form because it's easy to read and go through

**Imran Shabbir:** template.

**Taha Raja:** it. But I don't know you guys can tell me more. Any rapid assessment I've been on, I have not come back as far. Oh, I wish you had done it this way. It's the content which matters more than the Yeah. But here, but the thing I'm I'm trying to question is which content do you expect the customer to be able to digest? Because many times I've been on rapid assessment reviews, you

**Michael Flynn:** you find the customer has never read the verbose stuff. That's true. I mean that's right. And and so the thing is is it better to present the tabular format up front so that at least they have some knowledge already have digested.

### **01:51:49**

**Taha Raja:** where they feel like, okay,

**Michael Flynn:** I can go through this and I know what overall what this is about.

**Taha Raja:** I I may not have read the appendix. And then you can gently direct the customer to say, "By the way, I know you're asking a lot of questions about this. Let me help you review this. Go to this section and even point him to that one. Then he'll know that, okay, I've got all these details." Yeah. I did.

**Michael Flynn:** I think for the purpose of these conversations that happen around the rapid assessments, the tables create that quick, concise checklist that everybody's looking for regardless of how they like data. Yes. And so that's why I love it on the front end. I I because AI is going to do all this to me. Like if it was if you're putting it on my plate in the old days and said, "Hey, also add this." I'll be like, "f\*\*\*, I can add an appendix." Yeah, that's that's my point. But because AI can do it, then for the people who want the verbose information, it satisfies that for them.

### **01:52:44** {#01:52:44}

**Michael Flynn:** I I mostly agree with all of that. I think one thing I just want to throw out there for consideration is that on the call in the presentation one option that is we've now have on the table is using PowerPoint instead of this. So do we still need to go short and then long if what we're presenting is not even going to be the word document I think answer is yes still but yeah I think it's yes because presentation is not something you may share with the customer. Right. Right. Presentation is part of your tool to use in your review meeting but the document will remain as a deliverable to the current person as a reference material and it can also serve as an easy way remember our next objective is to feed this into a sum that's right and would the table and verbose help the AI to properly create the right text and and billing categories as well right you want all this to flow in is there a reason we're fighting breaking this out into a

**Taha Raja:** sheet because we're talking about a table in a word document that has very limited

### **01:53:43** {#01:53:43}

**Michael Flynn:** First,

**Taha Raja:** width. Yeah. And where Ron just said, I I like to have a number, a title, a description, the LOE min, the LOE max, what you priority. That's You can't do that in a No, no. I mean, look, I mean,

**Michael Flynn:** two,

**Taha Raja:** whether you do that in rows

**Michael Flynn:** three, four rows. I think we can agree on doing three.

**Taha Raja:** at least and it looks fine. Could you pull up yesterday's document point where we'll let AI do

**Michael Flynn:** And I guess we're up to the

**Taha Raja:** this? Why not say, "Hey,

**Michael Flynn:** front.

**Taha Raja:** do it this way." Also, create a a Google sheet or an Excel document that has six columns and break it out there. And then you can go, hey, however way you want to adjust it, here it is. That's I again because AI is doing it.

**Michael Flynn:** It's not going to cost us any more effort.

**Taha Raja:** That's

**Michael Flynn:** something I would have never considered in the past,

### **01:54:37**

**Taha Raja:** against

**Michael Flynn:** but I'm like, "Yeah, right." Yeah. I mean, I told

**Taha Raja:** one. I took the one form and fed the document and said, "Give me a spreadsheet that I I forget how I exactly did it,

**Michael Flynn:** him

**Taha Raja:** but I I could see it where I was like, give me a spreadsheet that I can load into a sauna." Yeah. I'm almost positive it said I have I can connect to a sauna at that point. So I said, "Go ahead." Yeah. Here's a

**Michael Flynn:** structural question that I don't think um we can answer until we get a little further

**Taha Raja:** bigger

**Michael Flynn:** down the load with our developer. But should all of these things go into a some sort of database that we have work off

**Taha Raja:** that we instead of

**Michael Flynn:** of longer term I can see us

**Taha Raja:** well let's create

**Michael Flynn:** having the customer portal and just why why use a sun

**Taha Raja:** these Yeah, like whatever our front end

**Michael Flynn:** and is like there's a database that runs it underneath and all this stuff starts in the database.

### **01:55:36** {#01:55:36}

**Michael Flynn:** ASE and then whatever needs it whatever the presentation and then these docs are outputs of the database. Yeah. Yeah. Yeah. Well, that certainly longterm improves your AI memory of everything we've ever Exactly. That's why I'm wondering like this no longer lives in a document. This is now a structural part of whatever system we have built. And and like you said, same thing. You can still produce a document from that information.

**Taha Raja:** Sure. You're essentially just taking the the work and storing it in a database.

**Imran Shabbir:** document.

**Taha Raja:** Yeah. I mean, at the end of the day,

**Michael Flynn:** we work on today.

**Taha Raja:** everything this and making it so structured data

**Michael Flynn:** Although AI is actually changing.

**Taha Raja:** is less necessary. Yeah. Right. So, Google Drive like to me we're going down this path. We're talking about creating an application for us to

**Michael Flynn:** Yeah. Correct.

**Taha Raja:** manage

**Michael Flynn:** Why don't we make that customerf facing and say, "Hey, here customer instead of joining us on here's our

### **01:56:31**

**Taha Raja:** portal. Well, we've already talked about that, right? And then let them take that and move the project into there. That is the direction I am leaning is that I don't think I think we go

**Michael Flynn:** dumb. What we built is actually some sort of AI powered project management tool. Yeah. That like just for recording though,

**Taha Raja:** That is not

**Michael Flynn:** but that actually can execute something. But I will tell you one of the things that I want to do is you know I don't know how effectively claw data mining capability in the

**Taha Raja:** anthropic has access to the the D.

**Michael Flynn:** workspace but one of the options that I talked to ash about is okay so let's say we are entropic favor but to access the workspace are you able to access Gemini access to the workspace you know

**Taha Raja:** Because Gemini has indexes in the back end to be able to get the documents.

**Michael Flynn:** you're done so you know quick yeah that's

**Taha Raja:** Yeah.

**Michael Flynn:** fair I think it's and honestly however we build this It probably should be built so that your model can be changed out on the back if we do change the Yeah, whichever is the best to work on that works.

### **01:57:39** {#01:57:39}

**Michael Flynn:** The

**Imran Shabbir:** I'm suggesting because if you have your own

**Michael Flynn:** reason

**Taha Raja:** The one thing I've noticed about us,

**Imran Shabbir:** database

**Taha Raja:** okay, if

**Michael Flynn:** build another database and you're storing documents in Google Drive.

**Taha Raja:** you

**Michael Flynn:** Now you have two silos again, right?

**Taha Raja:** Oh,

**Michael Flynn:** And now you have the problem of going to make sure all

**Taha Raja:** where does the data set every time? Yeah. How do you replicate?

**Michael Flynn:** that sync.

**Taha Raja:** How do you replicate

**Michael Flynn:** It's interesting that the one tool that Google never

**Taha Raja:** it was from office was the database with some other

**Michael Flynn:** Yeah. I mean it integrates with space on the back end now has those data

**Taha Raja:** data. Eat the

**Michael Flynn:** indexes that that the search and Gemini utilizes. Okay. Right. So it it is a database in the back end. It's just that you don't have access to the tables. Right. But build your own data.

### **01:58:24**

**Michael Flynn:** No, you can't. You can't. You you there is a uh on the cloud there is a way to build a database. Yeah, there are a lot of great databases. Yeah. I mean, in fact, Google has their own competitor to a database that you can enable on the cloud. Yes. So, but but the thing is if AI, whether it's Claude or Gemini or whatever is the best to access that workspace information, it's already organized in a database format. It has access to those indexes and information. We leverage that because if a human being is going to be involved in making sure it's stored here, there or the other place, guaranteed chaos. Yes. But that's why like so from jump street, right? Like instead of just building this into a table within the document or a related sheets document, should it just start building in the database from scratch and then just pull the presentation layer into the document which yeah I mean I mean I realize that sounds fair.

### **01:59:25** {#01:59:25}

**Michael Flynn:** I realize with AI to Taha's point, there's fewer constraints now with having data all be in these same formats, but I still don't think it's a bad idea to do it anyway. Yeah. Well, I mean, there is some there is an argument on the AI side that actually says data with the way it can crawl it works better

**Taha Raja:** like simple markdown.

**Michael Flynn:** than structured. It feels like an open debate to me. I don't know if there's any. It seems like there are still different sides to that debate, but um which would probably I love the information. The level of information of

**Taha Raja:** like these. Okay, here's my 25 30 tasks that are stored in a flat text pipe delimited

**Michael Flynn:** these

**Taha Raja:** MD file, whatever format that can be used. Yes, I think that's fair. Um, at the same time, if we're talking about going into a portal and and again, I'll come probably going down the line, but getting to a portal where the customers can go, okay, here's here's our things.

### **02:00:26**

**Taha Raja:** We reviewed them. Here's the portal. Here's where we're going to work on all of them. They communicate in there. Now you start getting into now I got to store updates and logs and s\*\*\* like that in a flat file that'll get out of hand. Well, maybe not. For a human for a human it absolutely would. There's Oh,

**Michael Flynn:** You wouldn't be writing for

**Taha Raja:** I wouldn't files but still if a if a if a task went on for a while and there was a lot

**Michael Flynn:** those.

**Taha Raja:** of context. Oh yeah. So I don't know the answer to this. I have

**Michael Flynn:** I have seen people online make the case that actually AI works better with that than it does.

**Taha Raja:** I don't know any better. know either. I think that's where

**Michael Flynn:** Well, maybe our maybe I can help add clarity to that as well. So,

**Taha Raja:** that's

**Michael Flynn:** there's a C sound in the beginning there.

### **02:01:11** {#02:01:11}

**Michael Flynn:** A it's instead of a How do you spell it? Is a A K S H.

**Imran Shabbir:** English verb.

**Michael Flynn:** Oh, I was missing the K. Okay. It's a

**Taha Raja:** how you spell

**Michael Flynn:** I almost said bless you. They don't have letters. They be symbols. No, Indians don't use symbols. I don't know. They don't need symbols. Uh I was just asking. So we got some feedback.

**Taha Raja:** I was asking Claude which format is better. So we can have I'm sure a

**Michael Flynn:** I mean there are

**Taha Raja:** lot of studies We're doing a quick brief fire.

**Michael Flynn:** some

**Imran Shabbir:** So sorry to disturb

**Taha Raja:** It's going to just be the alarm for a second.

**Imran Shabbir:** you.

**Taha Raja:** There's no worry until

**Michael Flynn:** fire happens to be the update from Luis. They found more burned items than the other burned items. Yeah,

**Imran Shabbir:** So the

**Michael Flynn:** guys said there were more burned items than originally thought and so that might be causing some of the lingering issues.

### **02:02:22** {#02:02:22}

**Imran Shabbir:** kind

**Michael Flynn:** We may not even need the ozone treatment if they clear all that out. Oh, cool. So, they're going to check again in the morning and see what the status is. So, so be on. So the two things I formatting

**Taha Raja:** what you do is text

**Imran Shabbir:** um beyond that

**Taha Raja:** versus I don't think there's one final

**Imran Shabbir:** Yeah, we can land on one or the

**Michael Flynn:** of

**Imran Shabbir:** other.

**Taha Raja:** answer somebody like or something like that But the main thing I want to ask is the two topics it missed out. So should I go back and ask can to refer to the sources and so if you could

**Imran Shabbir:** We

**Taha Raja:** find

**Michael Flynn:** which transcript it is and what the and we should ask Claude,

**Imran Shabbir:** win

**Taha Raja:** so so when I just told you when I made my very first iteration it missed there also when I asked back oh this is missing two key topics can you go back and

**Imran Shabbir:** our conversation and then pull back.

### **02:03:19**

**Taha Raja:** find why don't you try to repeat it let's see if

**Imran Shabbir:** So I'll show you my conversation replicated

**Taha Raja:** we can do if we

**Imran Shabbir:** again.

**Michael Flynn:** and find it out. You see this is this was my original prompt.

**Taha Raja:** Yeah, it provided whatever documentation a big part discussed

**Imran Shabbir:** So I said the report is missing

**Taha Raja:** during first Oh, it was very first assessment meeting regarding the Shopify order flow where customer is bringing

**Imran Shabbir:** order without customer deposit then fulfillment is in

**Taha Raja:** in which is resulting in payout mismatches is also missing payout

**Imran Shabbir:** ter

**Taha Raja:** flow which should be included in the report as an issue with copy hit that copy.

**Imran Shabbir:** Let's give this

**Michael Flynn:** the newest version. Yeah. Let's And also also add in a sentence about could you also tell

**Imran Shabbir:** to

**Michael Flynn:** me why you missed that or why you didn't pick up like see if you can get the why out of it. I think that would be interesting. And then and then it

### **02:04:14** {#02:04:14}

**Taha Raja:** Two more sessions there. Perfect. So did I do that?

**Michael Flynn:** added

**Taha Raja:** Oh, I did it in the report is missing big part discussed during first assessment meeting regarding the Shopify. It is also missing

**Michael Flynn:** Can you please

**Taha Raja:** listening to these also advice. Why were these missed the tracks and

**Imran Shabbir:** Nice.

**Michael Flynn:** Let's see what Cl said about the

**Taha Raja:** formatting? All right. Both can review both as rendered PDFs page by page plus objective readability score. Shinasty assessment. The numbered narrative style version is a stronger for ease of

**Imran Shabbir:** format for attention in today's this one is

**Taha Raja:** digestion.

**Imran Shabbir:** today's on several concrete points readability score despite despite being longer

**Taha Raja:** 4,000 versus it scores easier by standard formulas. Flesh reading versus flesh skin. Whatever these are some reading protos.

**Michael Flynn:** Okay. f\*\*\*.

**Imran Shabbir:** phone disconnected. So it takes the old

**Michael Flynn:** is better which I think we mostly agree with as well.

### **02:06:32**

**Michael Flynn:** Um,

**Imran Shabbir:** tape

**Michael Flynn:** okay. Let's let's go back to code and see what it's coming. This is probably one of the more important pieces. Why did it miss that stuff? Yeah, I'm doing something similar, but I'm backing it up to the discussion I had. I'm doing it in the context of the discussion I had last night about improving the document. So, I want to see if it understands. So, it says you're right.

**Imran Shabbir:** illness.

**Michael Flynn:** And this is a risk account and fix all three

**Imran Shabbir:** Let me explain what happened. Verify it against that.

**Michael Flynn:** deliverables confirmed. Zero customer didn't exist anywhere in the account.

**Imran Shabbir:** Get one more

**Michael Flynn:** Let me I have a question.

**Imran Shabbir:** data.

**Michael Flynn:** Yeah. So

**Imran Shabbir:** If there is a miss like this and we're obviously going to have

**Michael Flynn:** human person in the loop. So we expect to catch it but to assist the human being able to understand

**Imran Shabbir:** a

### **02:07:27** {#02:07:27}

**Michael Flynn:** what were the things because look I mean the meeting is long especially like with China you had it over many days unless you have some kind of a reference to remember all the major points. So what is the what what do you do to help make you cross reference, right? Because the obvious stuff is going to come to your mind immediately because if you do this right after this, that's the other thing that I want to make sure we enforce is that you need to do this exercise right after, right? Don't wait days or weeks. And that's part of our requirement. But even there, if a human being is responsible to cross check what are the reference documents he or she could use, to,

**Imran Shabbir:** Double check the points. Is

**Michael Flynn:** you know, almost like an independent,

**Imran Shabbir:** there,

**Michael Flynn:** you know what I'm saying? And because the thing is, you know, and I don't mean to belabor on this and and make it bulletproof,

**Imran Shabbir:** you know,

**Michael Flynn:** but just feel like the struggles I had when I was at rapid assessment

### **02:08:26**

**Imran Shabbir:** I just

**Michael Flynn:** was that yeah, I think it's maybe we need to break this down finer, right? like it needs to go through each transcript with a fine tooth comb and extract taskbased of that and then let it go through this

**Imran Shabbir:** Just bullet points How?

**Michael Flynn:** process. Then you go to that and that becomes a reference document. Yeah, it see which I thought it was doing but it seems let's see what it comes back with. Is it still working on it? What is it doing? So, Yeah. Well, so let's read let's read the whole thing from the top. It's still going, but so it is discript about this,

**Imran Shabbir:** It is saying there's only one line in the trans.

**Michael Flynn:** which doesn't seem to be the case from your what does that scroll up or maybe then it says it may be misunderstood. Good news. The RA1 source itself has only has that has only has that one line. Cash sales triggered post fulfillment create time mismatch risk.

### **02:09:32** {#02:09:32}

**Michael Flynn:** I did actually capture it per so the evidence MD should be what you're talking about. The mis happened downstream. Here's what went wrong. I underweighted a thin looking line relative to a loud one. My son was explicitly called the game that came out two sessions with a concrete dollar. They could be better. the Shopify order flow then line that came up once in one sentence in the first sentence is the exact same failure mode that comes from playbook it was didn't get

**Imran Shabbir:** How did I didn't act on the catch? Um, hey.

**Michael Flynn:** that alarm scared the s\*\*\* out of you to myself I mean he came and told us about it no I know but I was like right under it I mean it wasn't as loud here.

**Imran Shabbir:** The other one in the

**Michael Flynn:** It was loud as s\*\*\*. Speaker bathroom

**Imran Shabbir:** hallway.

**Michael Flynn:** doesn't So I don't really care like fixing it. I I think we need to dig deeper. So So what was the first thing?

### **02:10:51** {#02:10:51}

**Michael Flynn:** So basically said that it only came like the reason it didn't weight it super high was cuz it still only found one sentence about that top. Let's just empirically is that wrong? Yeah. Yeah. Let's look at the So I think we need to feed entire portion of the

**Imran Shabbir:** back in the entire

**Michael Flynn:** discussion if it's more than a sentence and and point out to that and ask how it Let's take one step back for a second. What is the benefit? Okay. So, first of all,

**Imran Shabbir:** is quad

**Michael Flynn:** I able to take actual video and view that and see the human interaction

**Imran Shabbir:** AR.

**Michael Flynn:** as an added context. Is that even possible? I don't think so, but it's worth exploring. Okay. The reason I ask is because that can if that is an additional data point I know it's going to be expensive from a tokenization standard but for this purpose does it make sense or is that is it valuable enough if it's not then we obviously need to discard it but maybe that's a question to be discussed with the AI or even audio where it can hear tone and yeah I Oh.

### **02:12:01** {#02:12:01}

**Michael Flynn:** Oh, why is this

**Imran Shabbir:** just three pages.

**Michael Flynn:** document?

**Imran Shabbir:** The the notes. Yeah. The the other subtle thing on on

**Michael Flynn:** So there is usually go to the left that three dots burger side. So there is Okay. Well, I wonder if something happened when we were copying it and moving it around. Sometimes Google Docs Sometimes when I copy do Google Docs in Windows Explorer, it you never do that. So, so maybe we have we may have we may have a data source problem here. Yes. Can you go to the original actually to this

**Imran Shabbir:** better.

**Michael Flynn:** one?

**Imran Shabbir:** Yeah. So, uh full notes

**Michael Flynn:** So, the way Google Docs works which I do not like this feature is that it has these two sections and it almost treats it like a two sub. It doesn't even treat it as a single document which is just f\*\*\*\*\* up. It's like why do you do that? I understand creating sections. It does that with transcriptions and summaries.

### **02:12:58**

**Michael Flynn:** Yeah. It's almost like two subdocuments within a document and it's like well it's one document. It's just one is the summary and the other one is the details. Yeah. Uh open the original one. See if that what has the problem as well. T going back to the point you were bringing up another subtle thing here. And I don't know whether as we're talking through all this stuff.

**Imran Shabbir:** I mean, I'm just

**Michael Flynn:** One of the things I've noticed is if you are on a call with a client in any capacity, whether it's ongoing stuff or it's intro stuff is very often they're in a conference room with six different people, right? And and right now the limitation is AI uses the name of whoever the person is that's that's logged into the meeting as all comments are

**Imran Shabbir:** Well,

**Michael Flynn:** from to discern if everybody introduces themselves.

**Imran Shabbir:** I don't know.

**Michael Flynn:** So, we're going to make here's who made the comments. I don't think so. Making those advances.

### **02:14:02**

**Michael Flynn:** Yeah, I'm not sure that it's super important from at least getting the comments from Sharon. Uh, but you know, making reference of who made that comment is important. That's what I mean. That's that's yeah, it's not the issue. It's who made it version of the transcript instead. But you know if if you ever have a question like that you can always reference the video from the notes right. No I know you get and you get the time stamps which is incredible. Yeah I mean as if if it becomes a critical issue. Yeah. It's it's a not a perfect answer but it's the only answer we've got I think at this stage. Yeah. So the other version has it. Oh yeah. 126\.

**Taha Raja:** So,

**Imran Shabbir:** stages.

**Michael Flynn:** like we've got a kind of an invalid test here. Yeah. So, let's let's rerun it. tell it, hey student use this sources um or use

**Imran Shabbir:** drives

**Michael Flynn:** Google,

### **02:15:01** {#02:15:01}

**Taha Raja:** It's face to copy the document over and over copy because well

**Michael Flynn:** you can copy. You can open an individual document and make a copy and then move it.

**Taha Raja:** you

**Michael Flynn:** Yes, you can't like rightclick five documents and say copy it, paste somewhere else, which is probably why I didn't do it that way because the link. So,

**Imran Shabbir:** Zip it. You zipped it. Oh, I don't I did zip it. So, what I did is I did it yesterday. I know you did these overnight.

**Michael Flynn:** Yeah, I I think I did this. Oh, no. These I just copied in Windows Explorer, which I'm guessing f\*\*\*\*\* up the documents. It's not. Oh, so maybe the zipped ones that you copied. So, one one of the problems with Windows drive capability is that a pure Google Docs document, which these are, not Word documents. Word documents will work fine. Pure Google Doc documents with the tabs and everything. with the tabs and everything and in the drive they're simply links to the website.

### **02:15:59** {#02:15:59}

**Michael Flynn:** They're not full documents. The only time they become real documents is if you say download a copy to my drive copy it

**Taha Raja:** But if you use that to simply use Windows functionality

**Michael Flynn:** fails.

**Taha Raja:** to

**Michael Flynn:** So it's a it's a big shortcoming. I don't know if that's a couple of questions here. So you often we won't have to be you can see it's 11K. Yeah. Assessment one. So let's let's

**Imran Shabbir:** This one has

**Michael Flynn:** reconfirm.

**Taha Raja:** has like Yeah, this one is full 65\.

**Imran Shabbir:** also

**Taha Raja:** Yeah. 100

**Michael Flynn:** Okay. Does that make sense? It's interesting. Uh Mike,

**Taha Raja:** pages.

**Michael Flynn:** if you did all the documents, only one of them seems to be screwed up. Maybe. Or maybe this is the one we're working. No, he's looking at it. Oh, he's Yeah, he's looking at it. It seems like the

**Taha Raja:** I remember you downloaded all four as a zip folder and then Yeah.

### **02:16:48**

**Michael Flynn:** other

**Taha Raja:** So, something went wrong. I don't

**Michael Flynn:** something else might have gone wrong. I think the way you did it was probably okay.

**Taha Raja:** know.

**Michael Flynn:** Okay. Yeah. So 75 something else might have gone wrong with that document. Yeah. So I think I think you should just just replace this

**Taha Raja:** Well, keep in

**Michael Flynn:** issue for the most part goes away because we're not going to make copies to do exercise like that.

**Taha Raja:** mind

**Michael Flynn:** Right. Although we will pro we may have I mean because we can't control where Google Drive saves it. It is going to we won't be making copies but we will be moving it because it always saves the recording in your Yeah. But as a reference, why can't you tell agent to say go to this folder to read the documents? Doesn't have to be in the local folder. If you if you have the MCP connection, it doesn't with code with code. It does, but although I mean asking it to crawl three different people's my recordings folder doesn't seem like a great process either either.

### **02:17:50** {#02:17:50}

**Michael Flynn:** What do you mean crawl? You give it the specific project folder, but it has to be but I mean recording meat recordings don't can't be dropped into that without you have to move them into that folder, right? UK. control where a meet recording lands by default. If you if I schedule a

**Taha Raja:** Can you go to it?

**Michael Flynn:** meeting to be a

**Taha Raja:** My the

**Michael Flynn:** part of the requirement if I go to the interface and I do organize it should move it completely in. So that might be that might be something that we may want to introduce as a process because it would be good to have all the recordings associated with the client into that for already have a script that doesn't Yeah. Yeah. Just do that now. In fact, it failed yesterday because our your meeting

**Taha Raja:** landed in my recordings or it found it and it doesn't know it wasn't the title wasn't formatted like because like

**Michael Flynn:** relying on a naming convention,

**Taha Raja:** right

**Michael Flynn:** right?

### **02:18:46**

**Michael Flynn:** Yeah. Well, it doesn't have to be that way.

**Imran Shabbir:** that probably we can

**Taha Raja:** I think

**Michael Flynn:** we can solve that problem to make sure it lands in the project folder.

**Imran Shabbir:** solve.

**Michael Flynn:** But and then I think if that happens then we probably resolve the issue because you could even write a a Google Workspace workflow and make sure it does that automatically you know and yeah it's just an appcript. It's a Google app script can absolutely solve them.

**Imran Shabbir:** Exactly.

**Taha Raja:** I think I think I think we can

**Michael Flynn:** We should solve that problem either.

**Imran Shabbir:** Sorry.

**Michael Flynn:** Yeah. And it's a good practice to have the meetings in the project folder anyway because that's easy then if you're doing research on that project of any kind absolutely which is essentially the forensics becomes very easy right which is essentially what how you're using notebook LM right now is making but if our tool is going to be the way to do things we're going to need it inebook

**Taha Raja:** Yeah. Um,

### **02:19:37** {#02:19:37}

**Michael Flynn:** Hello.

**Taha Raja:** but yes, you're right. It does rely on the naming convention of the meeting title to know where to move it. That's a good We could We could figure out a way to do it, though. Well,

**Michael Flynn:** Easy way to do it. No, there is no easy way. And you know what? There may be a human factor involved here for now to make sure this happens. So all that happens is I get an error and it's

**Taha Raja:** says, "I don't know where to move this." And then I look and either I have to I think I can even adjust the title of the file. Oh. And fix it. Like if yours yours yesterday just said AI summit. Now if I just put PC internal space pipe space into my folder,

**Michael Flynn:** in front of that. It'll move

**Taha Raja:** my PC internal folder. Ah.

**Michael Flynn:** it.

**Taha Raja:** But if it doesn't have that initial pipe piece of it, that's the customer.

### **02:20:30**

**Taha Raja:** It's like customer spice space,

**Imran Shabbir:** Pipes.

**Michael Flynn:** Does it move it? then then I don't have access

**Taha Raja:** right? We have access. It moves it into the customer folder out of my recordings into which is PC internal in this case. Yes. Well, yeah. Yeah. This like 44 Pro, it just shves it into 44\. Now, the 44 Pro gloves folder isn't named 44 Pro. Oh, so there's an alias in the script. There's a little there's a little bit of list like temperaments my meetings Temperman's

**Michael Flynn:** same way. I I name

**Taha Raja:** but the folder is mte l so I have to kind of if it if it's on if it's one to one you don't need a reference but it does have a list in there so you can map it explicitly it should be able to be a little fuzzy and even ask for confirmation like hey I think this should be moved here it does do fuzzy like if I just do barbell it'll move it to

### **02:21:23**

**Imran Shabbir:** barbell. Okay. You know, stuff like

**Michael Flynn:** H this is good because I I think this we we will need something like this.

**Imran Shabbir:** that.

**Michael Flynn:** Yeah. But sometimes customers will invite you to a meeting that says hey like one-on-one with link like Yeah. So your your your think calendar thing solves that right. So what I because it asks the specific question and then puts it into they book through my link if they send me their own meeting calendar. Yeah. So what I do in that case is I just change it on my Google calendar and it only changes the meeting title for me. Yes. But now I also don't get

**Taha Raja:** is I don't get Google notes from that meeting,

**Michael Flynn:** the

**Taha Raja:** but Granola does. Yeah. And if Granola uses that title, it knows where to Yeah.

**Michael Flynn:** is already doing granola too.

**Taha Raja:** Mine is Yeah.

**Michael Flynn:** My brain know my brain is

**Taha Raja:** But I'm saying if I if I did want to like download that stuff and move it, I think all of it ends up moving into a different function no matter what.

### **02:22:21**

**Taha Raja:** Essentially, I would I would port that script

**Imran Shabbir:** to my brain and be like,

**Taha Raja:** into my

**Michael Flynn:** when you sync move

**Taha Raja:** meetings.

**Imran Shabbir:** "Okay.

**Michael Flynn:** up.

**Taha Raja:** All right. So, the miss was good.

**Michael Flynn:** It was like at least in fact that it just had the the raw data was was missing. Yes, I think there's some other feedback for format and stuff that we're going to need to give it. Um, interesting. So, I I went back up to my assessment and proposals one before we figured out the problems and I said, you know, I actually didn't give it any prompt. I just said, "Hey, we you know, everything we talked about fixing last night, here's the new document. What do you think?" And it immediately said, "We still missed that. What happened?" And it's it found that we don't have the complete document. So it's now it's now going back and trying to look for the full document on its own. I think it also copied the link to the source.

### **02:23:17** {#02:23:17}

**Michael Flynn:** Got the file to the source folder. what we heard. Excuse me. Um, so going back to the question Taha asked about I mean make it as much bullet as

**Imran Shabbir:** You can only be stumbling maybe but

**Michael Flynn:** you like it misses it

**Imran Shabbir:** uh like long conversations,

**Michael Flynn:** and you don't remember it.

**Imran Shabbir:** right? As well like he suggested that what we elevate that

**Taha Raja:** Whatever the document MD file

**Imran Shabbir:** document to a reference document for you because there is a document that it creates, right?

**Michael Flynn:** Yes, it's parading this evidence MD file. And we elevate that as

**Taha Raja:** checklist for you as a starting point.

**Michael Flynn:** it

**Taha Raja:** But again, if it missed it and I missed it, then what am I checking again? Well,

**Michael Flynn:** point.

**Taha Raja:** you can

**Michael Flynn:** We're relying on something. Yeah. So we can beef up the evidence MD file and beef up the instructions that it be like it capture everything. It doesn't make any judgment about how important it like makes sure to try to grab everything it can.

### **02:24:29**

**Michael Flynn:** Um but at some point something is relied upon whether it's your memory this file your some notes you took like if everything misses it like there's always no matter how many tools we put in place important or relevant enough right because the one thing I do is

**Taha Raja:** Everything is recording and transcribing. I still do take notes and those notes are just the topics worth remembering. That's but that's about it. Um reading is not easy.

**Michael Flynn:** It's 100

**Taha Raja:** So I just, you know,

**Michael Flynn:** structure.

**Taha Raja:** some of some of the big ones you just remember no matter what. It's never going to be perfect in any way because like you said, that's subjective to you. Yeah, I that's because the the customer brought something else up in that call that was maybe they only brought it up one time like you said like that document thought like, hey, I only saw one sentence about it. Okay, fair. Oh, yeah. But that's and and I didn't take that note to be like, hey, this is important.

### **02:25:32**

**Taha Raja:** So it was left out.

**Michael Flynn:** But then the customer comes back and says,

**Taha Raja:** We missed this. So,

**Michael Flynn:** "Hey,

**Taha Raja:** so here here's my thing right now. Okay. I think creating an evidence briefed up evidence file for now could be

**Michael Flynn:** it's going to

**Taha Raja:** sufficient for now. We'll have to iterate down the road, but I think that's I mean we're talking this is the 8020 like we're never going to get to 100%. No. And this is a good start. I mean look I mean what we're doing right from the manual days that we all

**Michael Flynn:** now is a dramatic improvement,

**Taha Raja:** did many years back.

**Michael Flynn:** right? So infinite infinitely more more detailed and and faster, right? So so I think I think we we stop at this point. We can't.

**Taha Raja:** go for perfection and then we iterate again. Yeah. I mean, I'd be s I'd be surprised this the reason that got missed is because the data wasn't there and it only had that one line.

### **02:26:22** {#02:26:22}

**Taha Raja:** So, fine. If it has the data doesn't miss it, we've got to you got to assume that it's and I know I hate we hate to assume, but you got to kind of go on. Yeah. you're reviewing it and saying it was something I talked about and da da da, you know. Yeah. Yeah, I get it. Okay. So, I see it captured $43 million revenues, 34 from

**Imran Shabbir:** on e-commerce which is trouble.

**Taha Raja:** Amazon 40

**Imran Shabbir:** That's insane, man.

**Taha Raja:** million business. 43 million in skibies.

**Imran Shabbir:** Nice modal cotton.

**Michael Flynn:** Look at that I use the

**Imran Shabbir:** You have

**Michael Flynn:** meandies which same material. It's like I could never go back. Items are unchanged. We should get them as a customer. Do you get the elephant logo or I get the no elephant over here.

**Taha Raja:** f\*\*\*.

**Michael Flynn:** I am picturing Ta's next brambleberry thing of gifts for all of you. The elephant the giraffe is all the net growing.

### **02:27:50**

**Michael Flynn:** This is why I was like, Marie, you're sure you're okay working on this? I don't know. Everything looks perfectly normal to me. Okay, no more comments on this one.

**Imran Shabbir:** Wasn't

**Michael Flynn:** I like the fact that

**Imran Shabbir:** there something on there was

**Michael Flynn:** it I'm sure there pretty sure it was like a sports bra or something like that.

**Taha Raja:** Yeah. Things that are

**Michael Flynn:** There's a number of are people in various creative positions with each other, but like it does it's not obvious that that's what it is unless you zoom in. And I'm like, I can't really say this to her, but I want her to like I don't want her to be caught off

**Taha Raja:** All right. You know what?

**Michael Flynn:** guard.

**Taha Raja:** Fine.

**Michael Flynn:** You know, Maria Maria does come across as person with a little bit of a thick skin. She doesn't she doesn't get phased a lot. She's very Catholic. Like I know she knows how the world operates. She's mature enough.

### **02:28:50** {#02:28:50}

**Michael Flynn:** I'm sure she does. Yeah.

**Imran Shabbir:** Like that's

**Michael Flynn:** Mari,

**Taha Raja:** I don't know like how people in other countries and like other whatever like take those

**Imran Shabbir:** our

**Taha Raja:** things

**Michael Flynn:** it depends. I mean, I'd go to jail for wearing that in the Philippines probably.

**Taha Raja:** either

**Michael Flynn:** Really? No. Whereas the on the Germany, it' be on your office door. Singapore has the worst uh social rules. Like you you can't eat chewing gum outside. Yeah. It's prohibited. Yeah. because their sidewalks and everything are spotless. Yes. Uh literally

**Taha Raja:** If you if your social media has certain things

**Michael Flynn:** the state or anything like that.

**Taha Raja:** against it's it's a very strict

**Michael Flynn:** Uh you are arrested. I mean but the result of that is Singapore is

**Taha Raja:** society.

**Michael Flynn:** a model society when it comes to just social organization, cleanliness, city operation. I mean, you go to Singapore,

**Taha Raja:** Perfect.

**Michael Flynn:** it's like on some level Dubai is like that, right?

### **02:29:52** {#02:29:52}

**Michael Flynn:** Dubai is worse. But Dubai is authorit. Yeah. But like your friend Mark was telling us like he's like you could walk around with your wallet and top your head. Nobody's ever going to touch it. Yes. If they do, they're out. Gone. Yeah. Yeah. Whereas like Japan is more it's a more of a social show social show social show social show social show social show social show social show social show social show social show cultural thing. Like I don't know if you noticed the World Cup that when the Japanese fans leave they take all the all the trash. So when I was in Japan there's not a single trash can anywhere in the public area.

**Taha Raja:** You have to carry it.

**Michael Flynn:** Yeah.

**Taha Raja:** You have to carry your trash with you back home. And the roads are

**Michael Flynn:** and clean.

**Taha Raja:** big.

**Michael Flynn:** I mean, I have never seen a country so clean. You are not allowed to eat while walking.

### **02:30:40**

**Michael Flynn:** It's It's taboo. It's not against the law, but it's taboo to walk

**Taha Raja:** with an ice cream or or a drink in your hand.

**Michael Flynn:** around going to

**Taha Raja:** If you buy something from a restaurant that's

**Michael Flynn:** stall.

**Taha Raja:** either

**Michael Flynn:** They'll have a marked area on the pavement that says, "Stand here and finish eating.

**Taha Raja:** interesting, you know, and the restrooms the most public

**Michael Flynn:** restrooms were I mean literally as if like they were brand new installed today. It was like you go to a public restroom in New York, you might want to piss on the sidewalk. Oh yeah. you know, because it it's cleaner leading

**Taha Raja:** the door in there is the fifth guy who mentioned that's how

**Michael Flynn:** up

**Taha Raja:** you find the restaurant Japan I was like how good can it be he's like the fifth guy who was mentioned Japan was

**Michael Flynn:** and that's lungs.

**Imran Shabbir:** are

**Taha Raja:** amazing is that the fourth thing you're mentioning so it has to be like really dude

**Imran Shabbir:** amazing.

### **02:31:35**

**Taha Raja:** everybody is fully automated with a day

**Michael Flynn:** So the Japanese toilets, right? Japanese toilets. I mean,

**Taha Raja:** Was

**Imran Shabbir:** Crazy.

**Michael Flynn:** it was This is crazy good.

**Imran Shabbir:** I was like

**Michael Flynn:** You know what that reminds me of?

**Taha Raja:** it uh demolition man?

**Michael Flynn:** What's the three show? Yeah. So,

**Taha Raja:** That's right.

**Michael Flynn:** Steve Baker, our business partner, he was he he did some time in Japan with the Marines. And you remember Wade? Yeah. Was it Crawford? What was his last name? He was he was with Steve in that infantry unit. And he said they were on this program where they'd go in and visit and have dinner with with Japanese locals. And he said Wade Wade went in the bathroom. He had to use the bathroom. and he like couldn't figure out how to make it work. So he sits down, you know, drops the deuce and then he's like not trying to he's trying to figure out because everything was in Japanese.

### **02:32:30**

**Michael Flynn:** They said the toilet ended up overflowing. And so the new toilets uh that were in our hotels were fully automatic. Yeah. It would like as soon as you got up, it automatically flushed. It even put a new air freshener out. I mean it was just fully automatic. I mean, it was like you sit down, it cleans your ass, cleans your every I mean, it does everything. You literally don't do s\*\*\*. And he was like, "Dude,

**Taha Raja:** That's the only thing.

**Michael Flynn:** Yeah,

**Imran Shabbir:** That's true. It might

**Michael Flynn:** I might even reach in and try to do that. I was like,

**Imran Shabbir:** even

**Michael Flynn:** could you imagine? I mean, it was just incredible. It

**Taha Raja:** I was like, and these were in every hotel we went to.

**Michael Flynn:** was

**Taha Raja:** We went to all kinds of hotels. This is not the highest

**Michael Flynn:** by any means. Yeah. And they were like,

**Taha Raja:** end.

### **02:33:19** {#02:33:19}

**Michael Flynn:** Yeah. But the only other thing is the local hotels over there, the beds are all on the floor. They don't have a bed. It's the traditional style uh

**Taha Raja:** And uh you know they all have

**Michael Flynn:** what they call uh an OSEN which is basically a sauna type I mean a jacuzzi type

**Taha Raja:** uh

**Michael Flynn:** facility and it's everything was just you know it's it's a little too rigid the society you appreciate the cleanliness you appreciate this but you can tell that the public is it's taboo it's it's not against the law but it's taboo to express your anger, express your concerns in a in a negative way. I mean like every hotel you go to, the concier, the receptionist, they're bowing down, they're talking softly. It doesn't matter even if s\*\*\* is wrong. Like they are consistent in how they respond to you, you know, and it's it's you can tell that there is some suppression as well. Yeah. In a society that probably manifests in a very different way.

### **02:34:23**

**Michael Flynn:** Yeah. Yeah. Anytime you hurt, anytime you repress in any way. Yeah. It eventually in some portion of the society is going to explode. Yeah. Yeah. This is much better, right? Which is this is like why they're a great candidate for used fetish underwear.

**Imran Shabbir:** China state to Japan. I

**Michael Flynn:** I'll tell you though, Japan has an incredible fascination with American products and American things. I think you can say American p\*\*\*, but probably.

**Imran Shabbir:** will.

**Michael Flynn:** But I mean but but I will tell you every shopping area you see an American boutique these cities where it

**Taha Raja:** for American something. They have entire

**Michael Flynn:** says American shopping stuff and it's like all things

**Taha Raja:** areas.

**Michael Flynn:** that you we consider to be bad things are sold there and people shop there. Yeah. I mean and they're I mean they're having birth a major population crisis. Yeah. but b a lot of culture shock from people moving into the country because they need more people to work.

### **02:35:26** {#02:35:26}

**Michael Flynn:** And I just saw there's some medium-sized cities having a major meltdown over the first mosque being built there in the city. Like for all the great stuff we see, they they've got a lot of they're very homogeneous society. They they do not like integration, assimilation. Yeah. Yeah. Well, because it dilutes their culture. Well, that's exactly right. It's the same thing with like the the French in Paris is they're super protective of their language and their culture and and that's the reason why that like the French are always perceived as assholes in Paris and and they are towards a lot of foreigners. Uh but it's because they are so protective of their language. Like I know it's French law that like all of these words there has to be a French equivalent. So in Japan they passed a law just recently that you cannot even apply for a Japanese residency or citizenship unless you pass level three language capability of Japanese which means you have to read and write because they are importing a lot of people in from Pakistan, Iran.

### **02:36:30**

**Michael Flynn:** Iran is one of their largest imports of people, but they don't want those people to become citizens unless you do level three. You pass a level three Japaneseization. Well, language is the first step in assimilating culture. Yeah. Yeah. Yeah. It's interesting like so it's hard big diversion, but Okay. All right. So, I went through the document

**Taha Raja:** it has definitely added those two points. Um and in fact

**Imran Shabbir:** That is the number one point. Now number one pain point.

**Taha Raja:** um so so I think we we answered one

**Imran Shabbir:** Why was it missing it?

**Taha Raja:** question was wrong so it has gotten now we can talk

**Imran Shabbir:** the source

**Taha Raja:** about verboseness or formatting or

**Imran Shabbir:** or repetition cuz I think if I go

**Taha Raja:** tabular this document if I am an executive or a customer

**Imran Shabbir:** through

**Taha Raja:** you're not even just executive I'll go through maybe first page which is also a lot of works but maybe I can spend some time reading it.

### **02:37:34** {#02:37:34}

**Taha Raja:** Anything else that may business overview but then current net tweet state.

**Imran Shabbir:** this like

**Taha Raja:** So my question will current state be part of the executive summary of business overview somewhere I

**Imran Shabbir:** In my

**Taha Raja:** think

**Michael Flynn:** We're scrap the executive the over the go back to the Thomas make sure I get the lines right.

**Imran Shabbir:** mind,

**Michael Flynn:** Okay. So the very first isn't it the most

**Taha Raja:** like I think it's a waste think every report

**Michael Flynn:** like the most generic

**Taha Raja:** should have like executives

**Imran Shabbir:** Sure. But maybe it's a paragraph. Yeah.

**Michael Flynn:** Maybe it just says, "Hey, we did this here. The point was I mean, I don't know." Like, I just don't know. I think it's one to two sentences at the most. Like, I I just don't like getting into these things that we're going to repeat later on. I don't know. I don't I don't get the purpose. But that's what the summary is, right? Uh

### **02:38:30**

**Imran Shabbir:** Matt Summers in this particular example is not going to go

**Taha Raja:** How many pages is this?

**Michael Flynn:** Again,

**Taha Raja:** 35 pages or something.

**Imran Shabbir:** through

**Taha Raja:** You might just read this and maybe some hours on the first or two task. So yeah, I mean that's a good point

**Michael Flynn:** I'd like to hear everybody's thought on it.

**Taha Raja:** and

**Michael Flynn:** Is I think summaries are important, executive summaries and all that are important to what is the purpose of those is the purpose of that is

**Taha Raja:** to let the customer that you understand who they are, what they are about. The purpose is not to

**Michael Flynn:** them what they are about because they already know that, right? So,

**Taha Raja:** Tell

**Michael Flynn:** is it makes sense to shorten it to the point where it communicates to the customer, we know who you are, we listened, we heard you. Yeah. Now, let's get to the brass tax of what where we're going. So, can we go to sections two and three? Yeah.

### **02:39:18** {#02:39:18}

**Michael Flynn:** So, one is executive summary.

**Taha Raja:** is business overview.

**Michael Flynn:** Number two,

**Taha Raja:** It's just about the business. Perfect. So if we give the business to operate today and then how their netswuite is set up

**Imran Shabbir:** overview how they isn't that more what I want to read.

**Taha Raja:** today,

**Imran Shabbir:** Yes, agreed.

**Michael Flynn:** Some of the

**Imran Shabbir:** And maybe some in the first section ends up in that section three which is the

**Michael Flynn:** detail

**Taha Raja:** sure,

**Imran Shabbir:** netswuite.

**Taha Raja:** but not as verbose and about as short as that is again that

**Imran Shabbir:** We already said the second paragraph is

**Taha Raja:** we

**Imran Shabbir:** useless.

**Taha Raja:** right in section like two

**Michael Flynn:** The good

**Imran Shabbir:** Maybe not the whole paragraph,

**Taha Raja:** pieces that big at the front

**Imran Shabbir:** but maybe reward it. But if it's of here's blah blah blah and

**Taha Raja:** section. Yeah, that gives me an over

**Imran Shabbir:** then or even if it's the second section, whatever. But these two, two and three need to stay whatever

### **02:40:09** {#02:40:09}

**Taha Raja:** whatever order. I agree.

**Imran Shabbir:** order.

**Taha Raja:** And maybe it's one big section. Maybe it's

**Imran Shabbir:** I understand who you are and I understand your current state. Yeah. I think who you are

**Michael Flynn:** far as a company they already know that we can state that what we know in a very short order is very important because they you understood their process.

**Taha Raja:** what your current state is. They want to make

**Michael Flynn:** Yes. Now I'll say who we are as a company varies as importance like there are some companies who will

**Taha Raja:** sure

**Michael Flynn:** say like this part of our brand or our personality or our presentation is like the most important thing right like we are a playful sarcastic somebody communicates something like that

**Imran Shabbir:** company and we want that to come through in everything we do is say it back to them to say we got this.

**Michael Flynn:** to you want a little

**Imran Shabbir:** Absolutely. So I even though that

**Michael Flynn:** flowery I like the way that this came capturing their identity.

### **02:41:05** {#02:41:05}

**Michael Flynn:** Like I get you. I know who you are.

**Imran Shabbir:** So keeping business

**Michael Flynn:** Yeah.

**Taha Raja:** I think again verboseness can be always and maybe elaborate a little bit on current nature state because these are

**Imran Shabbir:** overview

**Taha Raja:** just four lines or invest included in section

**Imran Shabbir:** like I think some of the stuff in section one could be

**Taha Raja:** three and then eliminate section

**Imran Shabbir:** okay. So maybe you can give a command to claw to merge these sections into two make it less

**Taha Raja:** official.

**Imran Shabbir:** verbose and and okay do you want that do you think that that bullet point list in section one that is like the the top

**Michael Flynn:** I have pain points. Whatever is

**Imran Shabbir:** five

**Taha Raja:** I don't I think that could come into

**Michael Flynn:** that

**Taha Raja:** the

**Imran Shabbir:** PowerPoint presentation and said instead of saying you showing you a table of 47 points

**Michael Flynn:** we went through. Here are the five to 10 most critical things that we discussed. There's a lot more and I'm happy to bring the table up if you want to but here are the biggest winners like the here are the biggest impact changes that we can action on first.

### **02:42:08**

**Michael Flynn:** Yeah, that I think it's

**Imran Shabbir:** to say it that way or to at least approach it that way because they're going to they're

**Michael Flynn:** important

**Imran Shabbir:** gonna

**Taha Raja:** I need to look at that PowerPoint with five issues and go away is the rest. Yeah.

**Michael Flynn:** I don't know what the section four is.

**Imran Shabbir:** and repeating the same things.

**Michael Flynn:** It's

**Imran Shabbir:** Yeah. So I don't think we need that

**Taha Raja:** And then section five is the main one proposed work items or

**Imran Shabbir:** or sprints whatever you call it and then gets into 5.1.

**Taha Raja:** streams

**Imran Shabbir:** this like in too many words but I'm

**Taha Raja:** you said but yeah it's the main one to cash payments payout settlement e-commerce payment

**Imran Shabbir:** sure

**Taha Raja:** reconciliation procedureation

**Imran Shabbir:** Amazon settlement reconcili so one thing I will say is and it's not really related to this docu

**Taha Raja:** with the Peppermint's one and I don't even know how long it was. I forget now, but when I reviewed it with them and they took it away, they had we reviewed it.

### **02:43:01** {#02:43:01}

**Taha Raja:** We I think you were on that call. We reviewed it with them. They they asked questions. They understood it and they took it away and they had an internal meeting. Their feedback from that was we had a one-hour meeting. We reviewed the document again.

**Imran Shabbir:** And at least three or four people stood up or

**Michael Flynn:** It felt like drinking from a

**Taha Raja:** holes. They like we didn't get anything out of it. It was just too much information with a bigger with a that they

**Michael Flynn:** fire

**Imran Shabbir:** larger group.

**Taha Raja:** didn't feel like they got enough out of it. They wanted to break it down smaller. Yep.

**Imran Shabbir:** Not saying that we did anything wrong.

**Taha Raja:** Now

**Imran Shabbir:** Just saying take that as feedback.

**Michael Flynn:** based on your volume of stuff we did with them. Did we I I'm trying to remember. Did we go away from the table format? I don't think so. But you know, look, I mean, feedback like that that may be very specific to certain customers may be the second iteration, right?

### **02:43:57** {#02:43:57}

**Michael Flynn:** Yeah. And that's I just want to bring it up just I think the first document needs deliverable that we all agreed

**Taha Raja:** to be standard

**Michael Flynn:** on. And then you know in your review meeting if the customer says I want to break down this way,

**Taha Raja:** power.

**Michael Flynn:** you add that additional feedback and say revise the document, revise the process. So, and this is where if we come down to phase seven for some customers, you may just say, "Hey, skip to here. Here's our proposed phasing and where we think you should and where you think you should take your first bite." Like, here's a bite-sized ch we had these things.

**Taha Raja:** So we think in phase

**Michael Flynn:** Phase two, we do these.

**Taha Raja:** one

**Michael Flynn:** And you know we can give them like for the people who want the full picture you go go examine that table and maybe even the appendix. Mhm. For the people who just want the big picture come down to the proposed phasing and if certainly if we break the table up into process area each person may just be able to look at their own table.

### **02:44:58** {#02:44:58}

**Michael Flynn:** So like I think we give the document maybe isn't even we probably

**Imran Shabbir:** It the

**Michael Flynn:** understand that most people won't read the document first letter to last letter of the document. Yeah. But if we create sections that different audiences with different needs can focus in on, I think that where do we put that in the PowerPoint?

**Taha Raja:** the PowerPoint. Where do we where do we tell them about the proposed phasing? It's like a conversation. I think it's a conversation but also maybe there's a we

**Michael Flynn:** Can I can I send you a didn't end up with table of

**Taha Raja:** don't

**Michael Flynn:** contents?

**Taha Raja:** these

**Michael Flynn:** I think maybe a table of contents is important in the document as well. Uh I'm going

**Taha Raja:** um six more

**Michael Flynn:** to

**Taha Raja:** sections. Yeah.

**Imran Shabbir:** Just because Ron asked,

**Taha Raja:** And assessment which I think we looked at yesterday.

**Imran Shabbir:** I've brought up the temperament rep does

**Taha Raja:** Yeah. Um but but it actually about like not having

### **02:45:59**

**Imran Shabbir:** like kind of lay out the way we're

**Taha Raja:** that initial section up top like look I I basically want to look at like the first couple sections. Okay.

**Michael Flynn:** I see you message on my

**Taha Raja:** And

**Michael Flynn:** person's kind of unique about them.

**Imran Shabbir:** I will say one thing. The right

**Michael Flynn:** That's the largest group of everybody participating in every single meeting that I've ever been

**Imran Shabbir:** number.

**Michael Flynn:** in. Yeah. Right. I mean like a lot of people like every major meeting had 14 participants and so far the three calls I've done two on demand planning and one on item price tags had a minimum of 10 people right I could see them all being added to

**Taha Raja:** Yes, but I guess

**Michael Flynn:** it

**Imran Shabbir:** My point here was like, can you scroll just scroll down a little bit?

**Taha Raja:** so

**Imran Shabbir:** Like actually scroll back up.

**Michael Flynn:** this has the same information right like it

**Imran Shabbir:** Sorry. Like this this information is for like that,

**Michael Flynn:** That's

### **02:46:54**

**Taha Raja:** yours. It's not

**Imran Shabbir:** but whatever.

**Taha Raja:** for

**Imran Shabbir:** It's there. All right. We have a visit overview. What did we do on site?

**Taha Raja:** Here's the date. Here's the location.

**Imran Shabbir:** Well,

**Michael Flynn:** even this might be long.

**Taha Raja:** Now,

**Michael Flynn:** I don't know. Or do we need

**Taha Raja:** but this isn't in the other document.

**Michael Flynn:** it?

**Imran Shabbir:** what this stuff is company overviews.

**Michael Flynn:** This big business models this big.

**Taha Raja:** Yep.

**Imran Shabbir:** This

**Michael Flynn:** I mean, and this is one page, right? Maybe. And it has our basically our

**Imran Shabbir:** netswuite landscape text is important. Yeah.

**Michael Flynn:** card.

**Imran Shabbir:** And then and then if you scroll down immediately I'm not saying that

**Taha Raja:** Recommended work items. Yeah. Now

**Imran Shabbir:** we can't reorganize things or like you said if we want to

**Michael Flynn:** Have a table up here instead of right.

**Imran Shabbir:** have do an overview of them so they can click

### **02:47:35**

**Taha Raja:** again,

**Michael Flynn:** Instead of this se

**Imran Shabbir:** into the verbose. Yeah. Yeah. This is Well, this was

**Michael Flynn:** My this was my memory was that um was that we because because of the nature of them that this was a somewhat unique engagement from our perspective. was that we kind of went away from the table format. Maybe that contributed towards the table's actually below as well. Oh, is it? Yeah, but that's the final table, right? And it's basically just an overview of the test, which I think I think we said we like.

**Imran Shabbir:** Um, yeah.

**Michael Flynn:** Yeah,

**Imran Shabbir:** Know, I love the overview table, but my point is here is in

**Michael Flynn:** it was straight verbose. And maybe Yes.

**Imran Shabbir:** this

**Michael Flynn:** Some of this might be like overkill because this is a pretty big one. Again, if you got if you got 14 people in the room reading through this, yeah, there that's what this is the final. The attention span is also going to be based on are they covering my section or not.

### **02:48:38** {#02:48:38}

**Michael Flynn:** And that's kind of my point is that uh it's unusual in my experience that if I'm talking about demand planning and I've got the two people on the call that are actually responsible for procurement and planning and buying Yeah. and everyone else is not. Yeah. you don't want to be reading through the Yeah. So, first six sections. It's not that I'm going to kick them out of the meeting or that I care. I mean, in many ways, I think it's great that there's this kind of level of collaboration and there, you know, it's almost like a hive mind thing, but um when you're then producing a document to cover all these sections, I could see people's eyes glazing over if I'm in purchasing and we're getting into the sales order, uh 50 scripts on the sales order. But then so here's the here's the summary of ours at the bottom,

**Taha Raja:** Yeah,

**Michael Flynn:** you know,

**Taha Raja:** like

**Michael Flynn:** again, I just want I only want to bring it up basically for the f for the

### **02:49:34** {#02:49:34}

**Imran Shabbir:** because I think it

**Michael Flynn:** be is eliminate certain things

**Taha Raja:** with what we're

**Imran Shabbir:** more

**Michael Flynn:** and trim down certain things. Yeah, I love the summary.

**Taha Raja:** Hey

**Michael Flynn:** Just get into the brass tax. Now, I think this table I I think we all agree this table should probably go above the verbose version and link to them. Yeah. Yeah.

**Taha Raja:** section.

**Michael Flynn:** with individual links through that part of it was like

**Taha Raja:** Yes. So but again you missed the first

**Michael Flynn:** the base the first three pages was a more cons um with like

**Taha Raja:** version what it's going through.

**Michael Flynn:** so so Justin has kind of an executive overview but he's just put a couple of bullet points in a table basically which I think was better. Yeah. Like right here. Well yeah this is the visit overview. So this is okay.

**Imran Shabbir:** We went outside. Whatever.

**Taha Raja:** comes down. Company overview is one paragraph like you just said,

### **02:50:29**

**Michael Flynn:** We don't need to reiterate to them what they we know it.

**Imran Shabbir:** Now

**Taha Raja:** right? We

**Michael Flynn:** Yeah.

**Taha Raja:** just,

**Michael Flynn:** Yeah. Yeah. And and even the bottom even the next couple kind of reiterate that, right?

**Taha Raja:** you know, that's that's kind of our we know what who you are and we know how we know your naturally set up. And now we're in the work items. Yeah, you're

**Michael Flynn:** We're saying that the table goes above,

**Taha Raja:** saying

**Michael Flynn:** right? Yes. Between those two sections. Correct. Yeah. Looking at this table.

**Taha Raja:** is the summary of LE That's No description at all. There's a very brief Oh, there's a brief description. Oh, there's another table after this. That's a summary of What's the other table? Summary of hours. No, these are these are the summary of estimated hours for the work items, right? And then this table that's the recommended phasing like we do

### **02:51:22** {#02:51:22}

**Michael Flynn:** Item 14 should probably come first and then

**Taha Raja:** like do these next phase these

**Michael Flynn:** we

**Taha Raja:** next phase. This is this is okay. I think the table can be towards the end. This

**Michael Flynn:** can be towards the end because you even this

**Imran Shabbir:** basically saying, "Hey, but I would

**Michael Flynn:** table the verbose stuff it needs to be at the very bottom you as a just

**Imran Shabbir:** tell

**Taha Raja:** thing.

**Michael Flynn:** almost like as I said like an appendix right sure that goes on there so the only other thing go back to the table of summary of the hours should be right before this yeah uh you know one yeah so I mean opinions on this I you when I used to create the table I would just have a little bit more on the description of the issue the proposed solution and then the estimated hours and that was the three columns I had. Although priority sounds nice as well. Um um you know but I'm so I think all we have to really do is expand the notes a little

### **02:52:23**

**Imran Shabbir:** Yeah,

**Taha Raja:** a little bit more verbose.

**Michael Flynn:** bit.

**Taha Raja:** Yeah. And then link to the to the real detail.

**Imran Shabbir:** that

**Michael Flynn:** Agreed. I think that's that's good enough.

**Taha Raja:** Yeah.

**Michael Flynn:** I think that should be good. And again, it doesn't have to be that exact,

**Taha Raja:** You know,

**Michael Flynn:** but I just want to trim down

**Taha Raja:** mainly I brought that up because the upper sections were kind of

**Michael Flynn:** to kind of what we've been talking about. Yep.

**Taha Raja:** You're right. That was a

**Michael Flynn:** And that will consciously made

**Taha Raja:** different

**Michael Flynn:** the decision to do that. And I and look, I don't think it caused any harm, but I think it I think probably the fire hose thing was more because there were so many people involved across the board who were then reading through this entire document. Yeah. instead of maybe reading through theirs. And maybe even on some of those sections, um maybe that would have helped to have a table because some of them are so like the scripting issues they have.

### **02:53:23**

**Michael Flynn:** So they're so dominant and and and that's what I'm saying. I think I think if we reorganize this file Yeah. and we put that table in the front and break it down by how we see their work streams, not necessarily order

**Taha Raja:** cash, but because we know that like certain people are involved in the the the contracts and the and that type of

**Michael Flynn:** But other people aren't. Yeah. Yeah. Sales people in that one. Yeah. They're uh well the price tag guy. The nature of their sales orders. There's so much stuff going in that going on in their sales orders. Yeah. that um it is not a it's just not a typical client, right? Because they're dealing with they're dealing with uh they're dealing with uh uh commissions, promotions, discounts, uh they're dealing with delivery. Um uh they're dealing with transfers. I mean, all these things are happening from that as offshoots and that's why there's so many freaking strips. Yeah.

### **02:54:25**

**Michael Flynn:** And uh and so literally it's got a spiderweb of all this different departments and people that it impacts and even outside software that it impacts. Yeah. So like I said, I think if we if we had

**Imran Shabbir:** the table up front.

**Michael Flynn:** had

**Imran Shabbir:** It would have given them a better way to to to break up that discussion and make it not

**Michael Flynn:** like a fire hose

**Imran Shabbir:** feel

**Taha Raja:** Guys, we have two more hours at least the schedule time.

**Michael Flynn:** So, I wanna Should we order lunch?

**Taha Raja:** Yeah.

**Michael Flynn:** We can order lunch, but I also want to like let's for the moment we've got some work to do, but let's assume we can get the document we want out of this phase and talk about what comes next. Um, so sorry.

**Taha Raja:** um

**Michael Flynn:** before we go there. Um, so I think there's a lot of

**Taha Raja:** on the formatting and templates and all that stuff, right? Um what would the process look like in terms of automation?

**Imran Shabbir:** productivity.

### **02:55:38** {#02:55:38}

**Taha Raja:** How do you envision that with this agent AI guys like we will not be using prompts? We will not be using all of

**Imran Shabbir:** Um, creating documents on MD documents.

**Taha Raja:** that will be in the back end and we will be having a user interface to answer a few questions and then it goes in the back picks up the correct model correct temperature correct I think. So

**Imran Shabbir:** Um, you

**Taha Raja:** um

**Michael Flynn:** Part of this answer will be the agentic

**Imran Shabbir:** know,

**Michael Flynn:** engineers best,

**Taha Raja:** opinion on what

**Michael Flynn:** but I'd like to like do you have a preference on like what you think would make a

**Taha Raja:** work

**Michael Flynn:** good work stream like what like Um, yeah. I I guess that's the question. Like I I mean I am I have my vision, but I want to I want this to be a collaboration here. I want to think about like what what you would think would would make sense, right? Like we have a new project starting. We've got the couple of recordings.

### **02:56:44** {#02:56:44}

**Michael Flynn:** Like how do we or maybe let's let's take it a step back. We're beginning a new project. Steve is engaged. Steve has a lead and he's calling them and he's gonna have his first pre-sales call with him that has to be recorded and stored somewhere. what are we doing? Because in my mind, that's where this process actually starts. All right. So, so, so yeah, that was my that's what I'm trying to figure out like once we done with this

**Imran Shabbir:** if you assign me a project two

**Michael Flynn:** later or

**Imran Shabbir:** weeks.

**Taha Raja:** anything different make something. Yeah, two things near-term and long term.

**Michael Flynn:** we will have a folder structure starting whatever day you take your next

**Taha Raja:** We

**Michael Flynn:** call where we want to make sure that the recordings get into that folder structure and then you open you work basically in cloud code the same way you did today by saying I'm working on lowle today I'm going to open the llay folder in cloud code and start my work with a prompt and a discussion and uh this is what I want to execute on like that we can do today these are ongoing projects does it make oh these are ongoing projects what

### **02:58:07**

**Taha Raja:** Okay, go ahead. Ongoing to re reorganize. So let me let's let's

**Michael Flynn:** ongoing projects as I think ongoing projects are a little bit harder. Um we don't we have not yet really given it any commands or instruction sets

**Taha Raja:** separate

**Michael Flynn:** on just daytoday strategizing tasks and conversation. Got it. Okay. Um, that said, still not a bad idea to just point cloud code at the existing customer folder with no and say, "Hey, this is what's happening. This is what we're thinking through. Here's what I'm thinking. Um, you know, can we, you know, how can you help me execute on this or something like that?" Okay. Yeah. Yeah. I don't know. But digress, but for a new, let's say you get a new rapid assessment, it's just All the source docs go into the

**Imran Shabbir:** New

**Michael Flynn:** folder and you just kick off the way we have in these two things.

**Imran Shabbir:** folder.

**Michael Flynn:** Say, "Hey, help me prep for the discovery sessions or the on-site, whatever you want to say." When you say new folder in the assessment folder,

### **02:59:15**

**Michael Flynn:** right? As of now, in the assessment, I I feel like we may rename that. We may reorganize a little bit, but yes, big picture. And I think big picture, we've got to think about how it cross-pollinates with the project traditional project folder as well because we need to make sure they correlate correct either with a shortcut or something. I'm not entirely sure put all of those the Power Cloud projects

**Taha Raja:** main cloud files in it would just and then we

**Michael Flynn:** folder and yes,

**Taha Raja:** can use the same structure we have now.

**Michael Flynn:** I think so.

**Taha Raja:** Yeah.

**Michael Flynn:** We don't have to do anything. We have to change anything at least. Correct. I think that's possibly the answer. Um, so I think that's probably the most likely answer. I mean, I know you said like put a folder above that,

**Taha Raja:** I kind of was thinking

**Michael Flynn:** below it, like so power projects, assessments, call it assessments now, which is what the assessments folder and then all the other ones get all the existing folders get moved into that folder, right?

### **03:00:23** {#03:00:23}

**Michael Flynn:** But the only thing in that assessments folder aside from subfolders is a couple of files.

**Taha Raja:** else. Yeah, good.

**Michael Flynn:** So I think you're right in there. I think you're right.

**Taha Raja:** Yes.

**Michael Flynn:** Yeah.

**Taha Raja:** Um work on new

**Michael Flynn:** Okay. Because then then you don't even have to change how for example like America

**Taha Raja:** customers or existing customers, I'm sorry. Because like I'm already moving all my recordings and s\*\*\* in there. And if I just go there and work in cloud code, I can then say, "Hey, read my recordings from the last five days. We talked about an issue XYZ. I need help solving this problem." Yeah.

**Michael Flynn:** Oh,

**Taha Raja:** And nothing really changes.

**Michael Flynn:** nothing really changes.

**Taha Raja:** So, as of today, I'm in. As of today, there's no

**Michael Flynn:** No real standard instruction sets to say help you solve this problem, help you solve this problem. There's no reason if you're just good enough. So, you'll be relying on your prompts to be better.

### **03:01:21**

**Michael Flynn:** Yeah, which is what I'm doing

**Taha Raja:** doing.

**Michael Flynn:** now.

**Taha Raja:** Hey, Brixton has a need to P an item rate rounding and then use it

**Michael Flynn:** Okay, fine. I just I brought in the conversation that I

**Taha Raja:** this way. I would just talk and it would go. Yeah, I think for existing one just the folder access is all you need and everything else we don't even need instruction at this point. M. So

**Michael Flynn:** Okay, that's a good one. Yeah. So, I mean, I'll I'll probably just put a line in the cloud MD file that says,

**Taha Raja:** yeah,

**Michael Flynn:** hey, we may also we'll also be using this folder structure for ongoing work. So, you know, do your best to use the MCP connection if specified and the recordings in the previous recording.

**Taha Raja:** and transcripts and uh that's red.

**Michael Flynn:** Yes. Solution any question? I don't know that it will matter

**Taha Raja:** because I'm sure it'll crawl the directories, but if we need

**Michael Flynn:** standardize the recordings or notes.

### **03:02:22** {#03:02:22}

**Imran Shabbir:** subfolder.

**Taha Raja:** to

**Imran Shabbir:** Yeah. So I

**Michael Flynn:** probably it probably wants them it's probably going to want them to be in source.

**Imran Shabbir:** mean

**Michael Flynn:** Okay. So, we could probably have Claude just go and move create a source subfolder and move every existing document into that source subfolder. I know some pe some projects have a folder structure already inside the project which yeah like I have like use cases in a subfolder and then handover docs in a subfolder just I'm just gonna use quad to do it.

**Taha Raja:** Let me take I'll take that part on. I can just say

**Michael Flynn:** I'm gonna have have a conversation with Claude and

**Taha Raja:** here's her existing So what need all the information, right? Yeah. But like to Mike's point, like scratch what I just said,

**Michael Flynn:** So if we started from

**Taha Raja:** I have use case documents that would go in source. So we move

**Michael Flynn:** I have handover documents that would be

**Taha Raja:** them.

**Imran Shabbir:** That would be in deliverables, you know what I mean?

### **03:03:15**

**Michael Flynn:** in

**Imran Shabbir:** And that's

**Taha Raja:** If that's how we change the structure, fine. I know where to get it.

**Imran Shabbir:** okay.

**Taha Raja:** I know where it goes. We each manage our own projects and move the folders and files. Move the files into those folders. Well, you may even be able to do it. I

**Michael Flynn:** Don't do don't do any moving yet. I want to investigate what's needed.

**Taha Raja:** think

**Michael Flynn:** I'm not doing anything. And like this this may be a cloud desktop. It doesn't farewell for you.

**Taha Raja:** yet was an important piece of them for

**Michael Flynn:** I just I want to clarify like I do we have to move the stuff? Do we not have to like I I because like right now if you create a folder and just put a bunch of recordings in it and say, "Hey, I want to prep for my on-site." Claude's going to say, "Okay, you need a source folder. Let me create the source folder and move everything in automatically." Will it just do that anyways the first time

### **03:04:21** {#03:04:21}

**Michael Flynn:** we do everything? Maybe if the answer is yes, then um I know in the past we talked about this billing and rates section and how we wanted to kind of come up with a standard blurb that goes in there every time verbatim. Is that still the case? And is that something that needs to go in the claude file or whatever instruction?

**Taha Raja:** We need probably that was in in my prompt that I use. Yeah,

**Michael Flynn:** explicitly says the billing

**Taha Raja:** it

**Imran Shabbir:** section should use this text verbatim.

**Michael Flynn:** rate I mean you probably have

**Imran Shabbir:** Okay.

**Taha Raja:** should have access to it.

**Michael Flynn:** access in yeah I think that can be boiler plate and there's probably two boiler plates one for Anderson Frank one for a direct customer um because with Anderson Frank I basically just say you know Everything here stated in hours. Your actual billable rate is per your agreement with Anderson. Something like that. So, so I assume that would be a question that if you if you if you set that up as a this section is either this text or that text depending on X.

### **03:05:43** {#03:05:43}

**Imran Shabbir:** It's going to ask

**Michael Flynn:** Yeah. If it's Anderson, right,

**Imran Shabbir:** you

**Michael Flynn:** which should only happen once.

**Taha Raja:** once and it'll probably we'll put that in the context

**Michael Flynn:** Should only or keep the basic info about

**Taha Raja:** file.

**Michael Flynn:** the customer. Um Todd to answer your question, it cannot do video or audio in our current setup. We got Uh,

**Taha Raja:** That's what we need to

**Michael Flynn:** it can't consume video or audio. That's why we're using transcripts.

**Taha Raja:** do.

**Michael Flynn:** That's fine. All right. I think we we resolved part of the issue with the fact that the file was not complete. Right. So, yeah. And then in the subsequent one, it caught it. Everything right. So, so big picture it sounds like

**Taha Raja:** We're kind of centering on this like

**Michael Flynn:** idea of our own like project management tool but different roles where it starts with it really probably starts with Steve create or Emily or whatever saleserson is in the I mean sales obviously I mean like just admin type s\*\*\* um saying hey we've got a new lead customer almost customer something in there.

### **03:06:52**

**Michael Flynn:** Um I think once they signed they that they engage there because they're going to have CRM tools on their side. I don't know. Right. And then they put their pre-all they put all their pre-sales calls in there into it. Maybe there's an attach button. Maybe it's a drag and drop. Maybe it uses folders. We don't know yet. But like I am thinking it I'm thinking the way they interact with it is in this one tool, right? Even if we're using a Google folder underneath, what they're doing is they're doing it in this tool. So, we're not going to different places. And then maybe there's some sort of status or something, but then you know they're either buttons to generate or something like that that follow our standard processes. So, we're not con done by prompts. Um although there's got to be a chat feature in there so that we can expand on this and we can continue the conversation and we can continue on this and then ideally the tasks get created and rendered in there.

### **03:07:55**

**Michael Flynn:** The customers can access that and see the ongoing tasks um interact and comment on it. Interact and comment. But there's got to be some behindthe-scenes stuff, right? We need privacy. Yeah. I don't we don't want them burning our tokens by putting things in there that cause the AI to act. Yep. So like an AI powered project management, a sana tool type tool

**Taha Raja:** is kind of what I'm leaning toward as far as where this all ultimately lives.

**Michael Flynn:** in the future state. I I would agree. I think that's the I mean you're almost you could almost call it an onboarding app. It's really not even just that.

**Taha Raja:** project management fine but what the steps that Steve Jason Emily whoever takes is maybe the onboarding piece of it where they create a new project and add the

**Michael Flynn:** stuff. It'll create the folder structure.

**Taha Raja:** initial

**Michael Flynn:** It'll do all that s\*\*\* for us. Prep it all. Yeah. and do things like I kind of like where you like Come

### **03:08:55**

**Taha Raja:** we have buttons like I can go in Ron go prep prep for onsite

**Michael Flynn:** here.

**Taha Raja:** Y but maybe instead of just hitting the button, hit the button and you get a modal window where you can give it extra instructions if you need

**Michael Flynn:** I hit go. They didn't give us access to the recording.

**Taha Raja:** to.

**Michael Flynn:** Yeah. Yeah. And I think you So this is kind of what sources thing kind of looked like. They had like a list of projects down one side and they could pop it open and there was like a stream of documents but also a chat window kind of little notebook ll um but with like a project navigation on the lefth hand side. I was hope I was going to see if they gave us the video so we could kind of show you what they were doing but they unfortunately did it on their Google and we only have the transcripts. So um why does customer need access to this? Because I think it becomes the replacement.

### **03:09:54**

**Michael Flynn:** That's where they go to see the tasks. That's where they go to comment on tasks. That's where they do. I mean I

**Taha Raja:** It part of me seems like we're recreating the wheel,

**Michael Flynn:** know

**Taha Raja:** but it I think it's simple. enough where I don't think it needs to be as like you know super like Microsoft project I mean we

**Michael Flynn:** you're essentially just creating creating the wheel here like I think that's what we are doing and I think that's what we want to

**Taha Raja:** are

**Michael Flynn:** do. Okay, fair.

**Taha Raja:** um well it it asai is only an aspect of this I mean you

**Michael Flynn:** I know. That's why that's what I was saying. Like I don't Yeah,

**Taha Raja:** know we could we could have it reference

**Michael Flynn:** but I don't know. I don't know that Asana does anything complex enough that it doesn't. Yeah. I mean, we're not using some many of the things that we're paying for asana. We're essentially using it as a ticket management task management

### **03:10:43**

**Taha Raja:** That's all we're asking.

**Michael Flynn:** tool.

**Taha Raja:** That's all we're asking for this

**Michael Flynn:** Rather than copying tasks into a different application,

**Taha Raja:** one.

**Michael Flynn:** why botherly probably need your project? And that that may affect how that

**Taha Raja:** So to answer your question about before about how it gets stored, we don't know that answer that may affect how Aka stores the data.

**Michael Flynn:** You said it right. And if we get rid of Assaar by paying his salary mention in there

**Taha Raja:** Uh, did you did

**Michael Flynn:** in that kind of bullet points um as part of that process that I chat well We have to buy license. We didn't but I'm

**Taha Raja:** Sorry, I'm hearing both conversations.

**Michael Flynn:** sorry I was saying did you mention in there that it automatically create a Google chat group as well for that particular client I didn't and then the question becomes like does it or does that does our chat somehow move into this tool and then if so is it somehow Google chat powered or are we writing our again to justice phrase re recreating the wheel and is there value to doing that or not value to doing I I tend to not like I like that part.

### **03:11:59** {#03:11:59}

**Michael Flynn:** I think I like having on Google infrastructure. Yeah, I was going to but the

**Taha Raja:** I was trying to figure out if there's a need. I like the I like the separation of creation.

**Michael Flynn:** creation I think can definitely

**Taha Raja:** I think could definitely happen. And even with the email address too,

**Michael Flynn:** help.

**Taha Raja:** it's probably hey create the create a Google chat group a channel with these five users and also create an email alias forwarded to these five users. So um and then what happens I mean the project management tool is like seems like a pretty ambitious it's Wait.

**Imran Shabbir:** We're not creating a project

**Michael Flynn:** tool, right? We're basically saying kind of task management.

**Imran Shabbir:** management

**Michael Flynn:** Yeah, task management and then the project management aspect can be cla functionality to pull all this data together like the executive summaries that created that's project management, right? That's basically saying, I'm looking at the task. I'm looking at your meeting notes. I'm looking at your email. I'm looking at everything and coming up with a summary of what you've accomplished in the past two weeks.

### **03:13:00**

**Michael Flynn:** What's past due? What's what's falling behind? That's project management that that we need. We're not trying to build a building where there's critical elements and all that. Even if those are get some insight into that as well.

**Taha Raja:** probably with the AI you could

**Michael Flynn:** Since we're talking about this, is this a good is it worth showing what Ashot had built for his prototype? Uh, you know, I don't know what he has given me that I've kept in mind or even in the recording. Was it worth showing some? Yeah, I mean, we could let me see if the content is there because it'll be easier to going through the

**Taha Raja:** I think I'm

**Michael Flynn:** recording that

**Taha Raja:** done.

**Michael Flynn:** Justin, did you make a copy of 44? I know we I gave that to you last second on Monday. A copy of 44 just the transcripts

**Taha Raja:** I think I did. And then is it easy enough to draw a

**Michael Flynn:** before what was recorded during your assessment and what's been recorded

### **03:13:57**

**Taha Raja:** line?

**Michael Flynn:** since you started the project. Oh.

**Taha Raja:** Let me look. I don't think I did.

**Imran Shabbir:** I think when we

**Michael Flynn:** I want to kind of kick Claude off tonight on doing some stuff on that and then

**Imran Shabbir:** ended

**Michael Flynn:** try to pick up that as a so implementation. Good bad news. Um,

**Taha Raja:** on site requirements. Oh, we did we did have Okay,

**Michael Flynn:** the

**Taha Raja:** we did have notes by Gemini. Okay, never mind. We also had notes though. We we're talking about the SDF stuff.

**Michael Flynn:** asep I'd like to I'd like to have it go through this and then produce some SDF stuff and for tomorrow's session. Let's do that. But I mean, do we want to even consider using the current exercise that we did? I want to do that for the rest of our time today. But I just want to have this big tomorrow.

**Taha Raja:** Chunk kind dual things.

**Michael Flynn:** Yeah.

**Taha Raja:** Take a bigger swing.

### **03:15:03**

**Michael Flynn:** Yeah. Yeah. Yeah. Absolutely. Okay. Makes sense. Makes sense.

**Taha Raja:** My blank account came through.

**Michael Flynn:** And I want to see

**Taha Raja:** Your what? They fought me

**Michael Flynn:** creating a blanket account, but I think I got it done.

**Taha Raja:** on

**Michael Flynn:** What would I mean? Isn't that like a demo account? Oh, you wanted a demo bank account. Yeah. Oh, I got it. Blank demo. Oh, nice. Okay. So all right. So what do you want everything

**Taha Raja:** pre-on site. Correct. Correct. Um and as if we

**Michael Flynn:** include up into and including the onsite? I want to start

**Taha Raja:** just got back as as if we just got back and we're ready to

**Michael Flynn:** it

**Taha Raja:** start.

**Michael Flynn:** just where to put

**Taha Raja:** So here I'm going to tell you

**Michael Flynn:** it.

**Taha Raja:** just

**Michael Flynn:** So you don't you don't want

### **03:16:11**

**Imran Shabbir:** You know what? Our

**Michael Flynn:** like

**Taha Raja:** requirements and solution design.

**Imran Shabbir:** our

**Taha Raja:** Nope. I don't like

**Michael Flynn:** definitely don't want that for now. Um, we may do the same thing where I go and do a compare, but right now I want to keep it honest and have it not know about that. Um, depending on how fast we work here and how much time people have tomorrow. I I might want to start giving it more sessions as we go on. Be like, okay, we we did the basics and now we had our first design session and here's the results of this. Go make changes. So, in that assessment and proposals folder, I made a 44 Pro and a source. Are we just going to drop it in

**Taha Raja:** I'll move it.

**Michael Flynn:** here?

**Taha Raja:** Where was here in the chat? Okay. No, that's um if you could use the web interface to move

**Michael Flynn:** Make sure we don't have that same problem again.

### **03:17:13**

**Michael Flynn:** Yeah. You know, even if I source Oh, you

**Taha Raja:** Extract in here, huh?

**Michael Flynn:** can't

**Taha Raja:** Oh, no. Zip extractor. So I uploaded the zip file.

**Michael Flynn:** because I had

**Taha Raja:** Um yeah,

**Michael Flynn:** to

**Taha Raja:** I had to kind of select seven files and then download them and then just just from down I did use the download from Google Chrome to drop it in the source.

**Michael Flynn:** I I don't know. I want

**Taha Raja:** Wonder if it will it's kind of got have tools to un to zip unzip it and read the files.

**Michael Flynn:** I'm

**Taha Raja:** No, I mean that would be useless for us. But actually, let's just do this. One sec. Um,

**Michael Flynn:** Sure.

**Taha Raja:** there

**Michael Flynn:** All right, they're there.

**Taha Raja:** Oh, okay.

**Michael Flynn:** I'll leave the zip I'll leave the zip file just

**Taha Raja:** Okay. And they all look like the right size and everything.

**Michael Flynn:** just

**Taha Raja:** Um,

**Imran Shabbir:** There we go.

### **03:19:46**

**Taha Raja:** so that development

**Michael Flynn:** Steve Steve. It was his BRD.

**Taha Raja:** It's opening now. Yeah, that looks the same. Uh, we go like sure the notes look good.

**Imran Shabbir:** Oh, I see what I did.

**Michael Flynn:** Uh they they do appear to be

**Taha Raja:** It didn't convert all of them to do uh word docs word

**Michael Flynn:** right.

**Taha Raja:** docs when I download but they're fully well I didn't open all of them but I opened like the BRD doc and the day two notes and the day two notes is 84 pages so I'll open the other ones just to double

**Imran Shabbir:** So we

**Taha Raja:** exhibit call with it's 1:00 though it's later today I

**Imran Shabbir:** have

**Taha Raja:** think oh it's in well I said one because it's my calendar is on Eastern but it's at noon okay in 25 minutes okay

**Imran Shabbir:** Oh,

**Taha Raja:** So you

**Imran Shabbir:** and this is just a

**Michael Flynn:** Is power

**Imran Shabbir:** normal

**Taha Raja:** when you said on our last call, hey, we're going to set up a every two week executive call.

### **03:21:32**

**Taha Raja:** So did you get a chance to communicate to him about this issue that you had?

**Michael Flynn:** like

**Taha Raja:** I didn't. Um, no. But I think it's worth bringing up on the call. Actually, might it's probably better because he's already seen the emails. I'm sure he has and they talked about it on the call yesterday. So bring that up. I would just assume bring it up on the call. Now to your point it won't be in writing. Well, I guess it will if we No, then you follow up.

**Imran Shabbir:** the writing thing about that. Okay. That he needs to approve

**Taha Raja:** We we we will you should explicit send this to you in a

**Imran Shabbir:** and

**Michael Flynn:** The rod

**Taha Raja:** ticket

**Imran Shabbir:** I want to send this to you on and I need explicit approval before I start working. What I didn't do is go in and see my recent

**Taha Raja:** uh logs to see how many hours I spent on it. Yeah, I don't want to do that.

### **03:22:20**

**Taha Raja:** Yeah, that's a long time.

**Michael Flynn:** going to take

**Taha Raja:** Yeah. So,

**Imran Shabbir:** and then bring that up by saying,

**Taha Raja:** just this will be rework on the project.

**Imran Shabbir:** "Hey,

**Taha Raja:** I've already called it that too. Rework on the project is buildable. You got to say that it's buildable as

**Imran Shabbir:** SP because it's project work.

**Taha Raja:** non

**Imran Shabbir:** I'm going have to

**Michael Flynn:** we do this. So please, I'm going to send this to you as an asana supplement ticket on that topic and I need you

**Taha Raja:** prove it because I won't

**Michael Flynn:** to work until you approve it. Yeah. be very very matter of fact about these things.

**Imran Shabbir:** And this is

**Michael Flynn:** Just something that I advise everybody do not ever feel even show emotionally apologetic that you're charging them. One of the things that we as consultants tend to do is we tend to think oh you know it will be a negative thing to mention that you are going to you need to get paid.

### **03:23:14**

**Michael Flynn:** Be very factual nonapologetic about it. And in fact, be bold about it. Because the thing is, as soon as you sound apologetic or have an inkling of emotionally reacting apologetic about it, Mhm. the human being on the other side senses that and they capitalize on it. Let's go

**Taha Raja:** Everybody else? Yeah. Comes with age and time and experience.

**Michael Flynn:** together.

**Taha Raja:** Um, because we all want to be nice, right? Well, you're still being nice. You're just not you

**Imran Shabbir:** being making sure he's soliciting the money

**Taha Raja:** reserve.

**Imran Shabbir:** that

**Taha Raja:** All right. So this place is missing.

**Imran Shabbir:** machine there's an opportunity here and that's true.

**Michael Flynn:** There are some workspaces that

**Taha Raja:** This isn't the first floor. There like multiple stories, right? There's an elevator to go up. Yeah. Yeah. I don't know what's the occupancy, but Well, you can see the labels here. I saw I saw he said we only have three offices open like this open for anyone.

### **03:24:20**

**Taha Raja:** No, no, no. Three spots that are open for worksp space. So, these it's a combination of meeting spaces and work. Yes. Yes. I saw. Yeah. Is

**Imran Shabbir:** 80 square ft is 900\. 80

**Michael Flynn:** It's like a small office like like a room 8 by Yeah,

**Taha Raja:** it

**Michael Flynn:** 8 by 10\. How much is it though? 800 bucks a month. Now, it gives you access to the printing and a few other things, but still it's expensive. And then a double that is almost like $1,400. But is that is that unlimited coming in? Is that No, no, that's your office then. Okay. So, yeah. So, if you rent office space one day a week,

**Taha Raja:** goodbye? and say

**Michael Flynn:** they have plans for that kind of I don't I didn't ask about that. They do. There's definitely like I

**Imran Shabbir:** See

**Taha Raja:** here, but there's definitely plans like that where I can say I pay like 250 a month and I get

### **03:25:05**

**Michael Flynn:** didn't

**Imran Shabbir:** us.

**Taha Raja:** access for x amount of hours or whatever it is. Right. Right. Yeah. Interesting.

**Michael Flynn:** Yeah,

**Taha Raja:** People

**Michael Flynn:** it's a similar concept of we work

**Imran Shabbir:** I think people have kind of done very

**Michael Flynn:** but

**Taha Raja:** variations of that. Yes. That's why I told

**Michael Flynn:** look into this because it's very very powerful. Yeah,

**Taha Raja:** him.

**Michael Flynn:** the place I used their rent's way more expensive. Yeah, MMW, of course, it comes with 10,000 ft of warehouse.

**Taha Raja:** So that's another thing, right? At least the one in Austin I've seen. There's a big actually it's a warehouse but then it has multiple rooms. So it's like they call it flex space where actually it's a warehouse but there are 10 other rooms which one room you just need one room to manage your operations. Nine others can

**Imran Shabbir:** So to tell you how you know things are getting out of

**Taha Raja:** be

### **03:26:11**

**Michael Flynn:** about this kind of stuff.

**Imran Shabbir:** Yeah.

**Michael Flynn:** There's a new development near my house where they call it man caves for rent. Man cave for owners garage. Fancy garage. Fancy garage with a loft, a place for TV and all that. And they just finished building it. I went in there

**Taha Raja:** just to ask. So hold

**Michael Flynn:** I mean,

**Taha Raja:** up.

**Michael Flynn:** it's the better version of like if you needed to store your boat somewhere, now you can store your boat and have a place to hang out with the guy. I mean, it's it's the better way. It's probably cheaper than your friend who runs the business for no reason. Just like any and your dad can hang out, right? Yeah. Exactly. Makes a sense, right?

**Imran Shabbir:** tougher than that. So we have we

**Michael Flynn:** There's a house between two of my buddies in a neighborhood.

**Imran Shabbir:** Yeah.

**Taha Raja:** was a house right between them that was for sale.

### **03:27:04**

**Taha Raja:** It's since been rented, but and there was also a house across the street that was for sale. Some of our friends moved back to Lake Virginia. We seriously contemplated like getting like four or five, six guys that work from home and buying their house as it out of our office. Yeah. Oh yeah,

**Imran Shabbir:** So using as our office and when we're not

**Taha Raja:** or that's our hangout spot. Like not even just for the guys,

**Imran Shabbir:** working

**Taha Raja:** but the guys like we hang out at like your house one night, your house one night, my house another night. Let's just go to the house, the clubhouse and hang out.

**Imran Shabbir:** when when Mike and I went to uh

**Taha Raja:** Yeah.

**Michael Flynn:** Rect grills in Augusta. The whole town does that the two weeks of the masters and practice rounds. The whole town like literally people turn their whole house into a Airbnb. Yep. And they rent it out and they pick they'll pick like a block of 10 houses and one of the houses they'll set as the dining hall.

### **03:27:57**

**Michael Flynn:** They move all the furniture out of it and just set up tables and they'll get up at, you know, 3:00 in the morning to do all the cooking and everything for the breakfast. Then the people go out on the course. They're on the course all day and they're eating egg salad sandwiches and pomeo cheese and that kind of stuff. And then they do a dinner service on like 700 p.m. or whatever. Interesting. And uh so they're so they're all I mean like the whole time like everybody even the owner of Rect Tech Grills who had a like a mansion. Well,

**Taha Raja:** Now like 40 grand

**Michael Flynn:** a week. Yeah. I mean, I I got I got wind of it because my nephew

**Taha Raja:** uh runs an insulation

**Michael Flynn:** thing and he got the project to insulate the whole place. And I was like, "Ze, why are

**Taha Raja:** this this thing. Isn't it like a warehouse? He said, "No, it's a man cave thing." And I went in there to check it out.

### **03:28:46**

**Taha Raja:** And it's got like multi-tiered space. You can put an

**Michael Flynn:** be in there. Oh, yeah. Boat, I guess. A car.

**Taha Raja:** AR

**Michael Flynn:** There is also people with classic cars in there. There's like the working space. Yeah. So, that's what my my father-in-law is into classic cars. He's got two of them. But in Jersey,

**Taha Raja:** he has a friend who's got like a collection. Yeah. And he

**Michael Flynn:** he had a whole setup in his house, but when they downsized and moved to Florida, like he didn't have room for it. So, he just went out guys on a different level. He bought a warehouse and like now it like looks like Route 66 in the warehouse. But like that's his hangoff sweat. He invites people. He invites the guys over to come take a look at his car and there's a bar in there and there's a big screen in there and and somebody's like, "Well, let me just make smaller versions of this." But this place you can either rent or own it actually.

### **03:29:37**

**Michael Flynn:** So you can own that space and then rent it, I guess. Let's own it. But that that project that longest

**Imran Shabbir:** It's a land that the development was not

**Michael Flynn:** time and then this started coming up.

**Imran Shabbir:** so

**Michael Flynn:** I said, "Man, it's an odd place to go to warehouse." But it's really not. It's a It's a major. Yeah. But I mean you know John Knoblin rainham

**Taha Raja:** He's like a big Ram guy,

**Michael Flynn:** Okay.

**Taha Raja:** big money guy in Rahham. But he's got he owns a couple like apartment complexes and one or two of the buildings in one of

**Michael Flynn:** Building.

**Taha Raja:** the probably like a 100 foot long building,

**Michael Flynn:** It's like a, you

**Taha Raja:** maybe bigger,

**Michael Flynn:** know,

**Taha Raja:** I don't even know. It's good size building and bottom line is the basement of a couple of the his apartment homes are just it's just garages and what he'll do is he has

**Michael Flynn:** garages. Like the whole basement is

### **03:30:26**

**Taha Raja:** cars. Yeah. But in the winter you can call him up and go, "Hey, John, I want to store my car in your garage in the winter because I don't have space for it, whatever, and I'm not going to drive it for the winter or boat." He goes, and he charges you $100 a month. You park it in there in October and you come get it in March. It's under the under an apartment building and it get there's access to it. There's no elements or nothing. Nobody goes down there. It's kind of cool. I wonder why the guy makes a

**Michael Flynn:** for money. He's got apartment buildings and then storage space underneath it.

**Taha Raja:** shitload.

**Michael Flynn:** Well, you're maximizing us of all the

**Taha Raja:** He's been doing that for years.

**Michael Flynn:** space.

**Taha Raja:** Like years. Yeah. Um, see you

**Michael Flynn:** You guys have that call in 15 minutes. I figure maybe the three of us will just get out of here and uh these Justin

### **03:31:12**

**Taha Raja:** guys,

**Michael Flynn:** and Taha have a call at noon. Yeah, it may not even take a half an hour. So, so maybe grab a bite.

**Imran Shabbir:** would be go next

**Michael Flynn:** There's there's like a Mexican place next door or something like that.

**Imran Shabbir:** door.

**Michael Flynn:** Okay, that sounds good. Um there's a bunch of spots all around here as you go towards the freeway, so you don't have to go there.

**Taha Raja:** you know, because I

**Michael Flynn:** But so what's the next steps? What are we doing next or what?

**Taha Raja:** I'm going to kick off

**Michael Flynn:** So for but I think what we should do next is actually dig into what it proposes as an action

**Taha Raja:** 40\.

**Michael Flynn:** plan for uh the one we've been working on China state. Okay. And take a look at it. This is going to be a little more interactive. We're going to have to push it to try to create some things and Oh, meaning like hey 44 might be a good one for that.

### **03:32:06**

**Taha Raja:** if it's done because like you'll have things like hey you add a custom field here and I'm making it up but like we're going to do this is custom field this that

**Michael Flynn:** So this is the solution we're going to put in place, but we need a custom record

**Taha Raja:** the other let it see if we can let it do that. Yeah,

**Michael Flynn:** roll or add

**Taha Raja:** something

**Imran Shabbir:** So good thing there.

**Taha Raja:** like

**Michael Flynn:** that's what I'm saying because our time today was till 1:00 p.m. So, do we have time to do what you're talking about or what what do we want to do? Um, no, probably not. Yeah. So, I mean, we may just want to call it for the day if you guys have a 12 o'clock call or you guys can continue to work or we can step out. I mean, yeah, we can step out.

**Taha Raja:** I don't have anything I have

**Michael Flynn:** I don't have I mean I don't time,

**Imran Shabbir:** I do right. right after that call.

### **03:33:02**

**Imran Shabbir:** I don't want to run

**Michael Flynn:** right? We're going to spend two more days here,

**Taha Raja:** So

**Michael Flynn:** half days. So, the 44 things probably going to take a little while to come up with.

**Imran Shabbir:** out.

**Michael Flynn:** Yeah. Yeah. How long it's going to be your call?

**Taha Raja:** all like probably 30 minutes and then it's a 30-minut call. Does anybody have any call at one like right after we end this or I have at 2:00 so I I can go longer than 1:00 cuz once you stop the momentum then coming back and restarting you know. So let

**Michael Flynn:** Mike start this process. I say we do in parallel the shiny one as well.

**Taha Raja:** let

**Michael Flynn:** Let it kick it off. Maybe he can kick it off, Mike, with your guidance. Y and uh get those two processes started.

**Taha Raja:** you can order lunch and come in like yesterday and that's when we do the call. Where we going to do the call? Right outside.

### **03:33:53**

**Taha Raja:** We can ask them if there's a room or something like that. I can hear from my car also. No, no, I didn't do it right now. I just didn't know if they were like going to be like both of us would be

**Imran Shabbir:** Somebody

**Taha Raja:** talking there. I'm sure it's not fully occupied, right?

**Imran Shabbir:** look

**Michael Flynn:** He's got a spot for it.

**Imran Shabbir:** like

**Michael Flynn:** Yeah. Going to the podcast studio. That's probably what it is actually. Yeah, there's a small office. Yeah, it's like a All right.

**Imran Shabbir:** Yeah, just something there.

**Taha Raja:** Okay.

**Michael Flynn:** So, what I'm doing right now, so Justin gave me all the pre-sales. Appreciate it. We'll step in. Thank you,

**Imran Shabbir:** the group. I guess it

**Taha Raja:** What? The group order cuz you'll be in the call when I order.

**Imran Shabbir:** is

**Michael Flynn:** sir.

**Taha Raja:** He wants to make sure we get food while you're here. Yeah. Yeah.

### **03:34:51**

**Taha Raja:** I'm hungry. Oh, you want me to start it or somebody else because you'll be on the call then? Yeah, somebody else start it and share it because then it'll make me check out and if I'm on the call, you guys won't check out. Okay. Yeah, we'll do it. Anybody have anything they want? I think Jersey Mike was the closest one. So, got a feeling like

**Michael Flynn:** Terasaria. There's there's stuff within 10 miles

**Imran Shabbir:** place that will deliver within 30 minutes,

**Michael Flynn:** of Don't Don't limit yourself

**Imran Shabbir:** 30, 35 minutes. So, you know,

**Michael Flynn:** to something really close because all

**Imran Shabbir:** Uber Eats drivers,

**Taha Raja:** everywhere and anywhere and anywhere.

**Imran Shabbir:** they all go get three seafood

**Taha Raja:** and take

**Imran Shabbir:** towers. So,

**Taha Raja:** some

**Imran Shabbir:** I I wouldn't limit it to something

**Michael Flynn:** because there's not a whole lot right here. Everything is going to be about 10 miles away.

**Taha Raja:** wrong

**Michael Flynn:** The good stuff.

### **03:35:50**

**Michael Flynn:** But you said you wanted Was Jersey mics what you wanted or you just thought it was close? I thought it was closest. Okay. Yeah, lunch. I'm very flexible. It's the dinner I want. Yeah, I mean Jersey Mike sounds. I'm going to move uh over there. Okay. Yeah. Situated that way. We can just get I'm going to send you guys a link to order. Hopefully you can do while you're Yeah. Just 10 minutes. Sounds

**Imran Shabbir:** Yeah.

**Michael Flynn:** like

**Imran Shabbir:** See

**Taha Raja:** Just answer

**Michael Flynn:** I've never had a Jersey Mike. Really? Real subs.

**Taha Raja:** again.

**Michael Flynn:** They have like Subway. No, they're real.

**Imran Shabbir:** Again,

**Michael Flynn:** They're definitely a notch above Subway. Of course, that's really good

**Imran Shabbir:** it's raining wraps and

**Michael Flynn:** food.

**Imran Shabbir:** shower

**Taha Raja:** Omar

**Michael Flynn:** Are they going to have something? How do you spell that? A U space A R order.

### **03:37:05**

**Michael Flynn:** I don't know if it's close or far. Just shows me my guests copy.

**Taha Raja:** link.

**Michael Flynn:** Oh, zero delivery fees. So here um what am I looking at? Yeah, I'm gonna put this summit. and in Texas if you that's an hour

**Taha Raja:** Welcome. Come back.

**Michael Flynn:** ago Italian doesn't sound right in the I can just order that and just I mean do.

**Taha Raja:** I just don't know what to

**Michael Flynn:** So these are big

**Taha Raja:** Okay, two

**Michael Flynn:** three maybe from that. Well now yeah this is too much for one person that Yeah.

**Taha Raja:** I can turn

**Michael Flynn:** whether or

**Taha Raja:** around.

**Michael Flynn:** not smoke brisket wrap the zinger

**Taha Raja:** spent on the shop.

**Michael Flynn:** These guys are going to be Dude, a wrap with fries and a drink. 32\. Oh, good. Thanks. No, no, no.

**Taha Raja:** So the range you will probably 15 to 20

**Michael Flynn:** Really?

**Taha Raja:** hours.

**Michael Flynn:** Like 102 cuz this bigger one with everything is

### **03:39:14**

**Taha Raja:** Tell look that's our guesstimate right now. It could

**Michael Flynn:** $13.

**Taha Raja:** be

**Michael Flynn:** So I just want to pay for

**Taha Raja:** just for them.

**Michael Flynn:** chicken.

**Taha Raja:** Let them provide an answer.

**Imran Shabbir:** So can you

**Michael Flynn:** Give us the

**Imran Shabbir:** get

**Taha Raja:** So,

**Michael Flynn:** barcode.

**Imran Shabbir:** let's

**Michael Flynn:** Oh god. Okay. So, chicken schwarma. That sounds That's pretty good. Oh, buy one get one free. So, if I take the pickles and sauce off, it's basically just chicken and a tortilla, right? That's one of the sauce. What's that? I just want the pickles. Gross. actually rather dipping sauce. f\*\*\* it. Right. Why? Every time I choose it, does it act like I'm getting two of them? Or is it buy one get one free? That's why we get it. I found it. And when you check out, maybe it gives the discount. level discount.

### **03:41:06**

**Michael Flynn:** Ron, do you have any preference or if I order a box, we can share it from this? Um, what are you looking at? Chicken zinger or chicken? What? Zinger. What is chicken zinger? Uh, it's fried chicken. It's a big box. That is a big box. Yeah, I've said this before. It's too much for one person. Yeah, that's probably too much for two people. Oh, no. No. Is it Are they schwarmers or they're just chicken? No, they're sh ones. Like they they cut it into small pieces like, you know, but they're fried chicken. That's fried chicken. Yes. Chicken zinger. Right. That the most famous KFC burger. Don't you have it here? Zinger is not a thing. KFC? What? I don't eat a KFC. I' I've never been to KFC in the US, but in Pakistan, I mean, I a zinger burger is like the most famous burger.

### **03:42:02**

**Michael Flynn:** It's fried chicken. Is that where it's Is that where it's like fried chicken replaces the bun and they try it? It's literally fried chicken and bun like you know. Oh, gotcha. But they call it a zinger in KFC thing. Maybe it's a KFC Pakistan thing. Um trying to see how big that is.

**Imran Shabbir:** cuz what I'm

**Michael Flynn:** the individual wraps are similar priced as the box.

**Imran Shabbir:** seeing

**Michael Flynn:** So, it makes me believe that it's going to be same size, which yes, we won't be able to finish either. A fair that's a fair point. Well, and and seems like it seems like the it seems like the wraps are all this buy one get one free stuff. That's true.

**Imran Shabbir:** surprise. Oh.

**Michael Flynn:** Uh well, I thought they I thought they came with Let's

**Imran Shabbir:** Uh

**Michael Flynn:** see. Oh, maybe they don't. Yeah, they don't. Okay. Yeah. I mean, if you want to get one of those, that's fine.

### **03:43:39**

**Michael Flynn:** Not to eat fried chicken days in a row for lunch just because I don't eat a lot of fried foods. That's true, actually. So, we can get the regular one. Okay. That' be perfect. I just I just want the size. I can get the beef one or Yeah. Yeah. I'm not picking I like beef lamb chicken like at all. The only one I won't do is tofu. Not because I don't like tofu. I just don't understand the pro the concept or it just doesn't make sense. I mean, I understand if you're vegetarian that's a good option, but I'm not vegetarian. So, okay. Look on the main menu. I'm going to go. I haven't had beef in a while, so maybe I can order beef. Okay, let's do they do a lamb for or no?

**Imran Shabbir:** Turns on.

**Michael Flynn:** They do lamb eo arabi. Let's do that. Number two most liked bread choice tortilla sh I don't know what the difference is but no lettuce, no tomatoes, no onions, no sauce, no pickles, cheese.

### **03:44:45**

**Michael Flynn:** Cheese is good. Tomatoes add all. So, you're doing the order for Ron? Uh, I'm ordering one. We're going to share. Yeah. Yeah. So, Ron is not gonna have a separate order. Yeah. Okay. is ready. I'm ready. Justin is adding items. Ron is adding items.

**Imran Shabbir:** Oh, there it goes.

**Michael Flynn:** Do you want Dr. Pepper with it? What are my options? I just see Dr. Pepper or a yogurt drink. I'll just check water here. All right. So, there's that. Where is the trying to get to the bins I've added to the menu? All right, Mike, what do you want me to do for us? So is this new guy um has started or about to start? He starts in mid August which is uh two weeks out. Okay. He has like sign and everything.

**Imran Shabbir:** That's the time he starting.

**Michael Flynn:** Um yeah like August 18th or something like that.

### **03:46:41**

**Michael Flynn:** Okay. um special

**Imran Shabbir:** Okay. So they don't have

**Michael Flynn:** there. So, everybody's ready, right? We can check out.

**Imran Shabbir:** any

**Michael Flynn:** What I don't know is is they have something that's indicating what capacity their bins are at. Don't say anything. What's the name of this building? Legacy. Legacy works. What is this? Oh, is it complete? Legacy works. Is this Katie or Pure? Where is this? I think Legacy Works. Yeah, legacy workspaces. Work spaces. See, uh, Richmond. Okay. Legacy workspace, Richmond, Texas. Go. be easier to look at tomorrow morning. Um, do you have a call at two? Yeah. Okay. So, I think two is the other stuff.

**Imran Shabbir:** I work until and then I'll take a call

**Michael Flynn:** Yeah. I've got to sync up with Justin on Temperman's wherever it fits into his

**Imran Shabbir:** and

### **03:48:21** {#03:48:21}

**Michael Flynn:** schedule. I've kind of blocked my calendar. I'm trying to figure out a meeting at some point with uh with Satchin for uh Foundry to keep their myriad of f\*\*\*\*\*\* task moving forward. They've got this guy Vinnie who's an outside contractor who's he's very sharp and he's actually really easy to work with. Which company? Foundry. But literally every email he sends out is like this much information. Okay. It's like if we were doing this and it was all that nothing but verbose. Yeah. and you're like, "Um, dude, I just need to know is this driven by API or is it?" You're like, like some of his some of the things that he he takes some very simple we just need to be able to do these things and he somehow gets that into it ends up being a three-page document with like, you know, all of these technical criteria. you're like okay you just need this items to you to sync with this quality comes over it's like like everything doesn't need to be a development project at at Oracle I think among a lot of other things one thing which they always focused on

### **03:49:49**

**Imran Shabbir:** When you speak or you write your customer, how can you be succinct enough?

**Michael Flynn:** is because

**Imran Shabbir:** There's no alternative to time. Yeah. If you spend 10 minutes explaining which can be done in 30 seconds, those 9 minutes, 30 seconds are gone. So word which comes out of your mind your mouth or in your

**Michael Flynn:** I think in every try

**Imran Shabbir:** email which is tough.

**Michael Flynn:** to overexlain things because I was just making sure are you

**Imran Shabbir:** There are things that are complex

**Michael Flynn:** know complex conversations and complex you know yes emails and documentation but there's a

**Imran Shabbir:** and

**Michael Flynn:** lot of stuff that is not but some of it like I've got two two good newses for you the news number one

**Imran Shabbir:** I'm always trying to think

**Michael Flynn:** even on stuff that's complex, how do I how do I how do I boil this down to its fundamental components? Yeah. So, we're all the same page of what the basic mechanics are of how this flows. Yeah. And um because then it makes complex stuff easier to understand, I think.

### **03:50:54** {#03:50:54}

**Michael Flynn:** All right. So,

**Imran Shabbir:** Mike,

**Michael Flynn:** so

**Imran Shabbir:** um, have you heard a peep from,

**Michael Flynn:** RM, no. Yeah, I think they're gone. They're out of contract, right? So, I don't think Yeah. Yeah. No, they've been out of contract. I went ahead and canceled my meetings. I sent Brian a note just said it was pleasure working with you. I don't know if anything's going to happen again or if you guys are even going to stay in that state long term, but yeah, I wonder if they switched or not. Yeah, I know they were actively evaluating the ethical round. All right. Uh yeah, let's pull up your the folder structure and look at the I forget what it calls the work file, but let's see what it has in it.

**Imran Shabbir:** connecting.

**Michael Flynn:** So they created these things, but none of that stuff shows up.

**Imran Shabbir:** Do you want to share because it's

**Michael Flynn:** Is there something else in here that they've done menu?

### **03:52:10** {#03:52:10}

**Michael Flynn:** I don't think there's anything in here you can do on that. Um, it's not connecting. I don't think you need to do anything on this. Not usually. Usually you just need to says couldn't connect. Great. Okay. So, I'm not sure we are connecting.

**Imran Shabbir:** Okay.

**Michael Flynn:** So, what do you want me to do, Mike? Go to structure for this shinasty reg. I guess we can close all these.

**Imran Shabbir:** version assessment and proposals.

**Michael Flynn:** So this is a a

**Imran Shabbir:** Mhm. So

**Michael Flynn:** sh redo.

**Imran Shabbir:** temperament

**Michael Flynn:** Um, go to deliver for me and the execution plan. And let's hit the Google Docker so we can read it a little easier. Environment production account. Okay, for some reason I couldn't get that. Got to look at that. I don't know why they can't get the but not too worried about the environment. We can update that. It did not get well

### **03:54:39**

**Imran Shabbir:** account ID something like that.

**Michael Flynn:** ridiculous but I should have been able to get it not connected or

**Imran Shabbir:** So every task below must be

**Michael Flynn:** use

**Imran Shabbir:** rescoped and was it that just give it a mention two max are the highest priority task in this plan added after the post okay got it 5.1 e-commerce customer deposit implementation problem to Shopify changes charge the order fulfill and then directly to cash and verified via Guess it verified via a script, right? Yep. Comes oh return zero. No, wait.

**Michael Flynn:** Excuse

**Imran Shabbir:** Oh, it has never created a single customer deposit which it's not trying to. So that makes sense. Yeah.

**Michael Flynn:** me. What happened?

**Imran Shabbir:** And the first time cash immediately at order dynasty used to trigger the cash sale immediately at the order with a monthly journal entry moving it to the deferred revenues bill unfulfilled items preference specifically to stop over billing wholesale customers or unfulfilled items that change also delayed customer e-commerce cash sale. This is again I think okay

### **03:56:33** {#03:56:33}

**Michael Flynn:** So

**Imran Shabbir:** what what is the purpose of this document?

**Michael Flynn:** what

**Imran Shabbir:** Basically to create a action

**Michael Flynn:** but this is the first time we're looking at it. So like this may not be what we want, right? I think part of part of what I want to do

**Imran Shabbir:** part of what we want.

**Michael Flynn:** is figure out what we want next, right? Customers approved. customers approved our rapid assessment. They're saying let's go forward. What do we want AI to do next? Okay. So, so far we have I mean and

**Imran Shabbir:** project has like at least three parts to it, right? Maybe two.

**Michael Flynn:** every

**Imran Shabbir:** One is the pre-sales until rapid assessment presentation types which we spent time at length. Yeah. How to you know expered make it efficient, productive, all that stuff. Second part is what's next? what what else can automate or help us make pay efficiency

**Michael Flynn:** Sure.

**Imran Shabbir:** um for any now this is when again that fork comes in for any implementation I think there are still quite a few things we can automate sure bringing data in creating records and all that stuff just in forms yeah so any rescue is

### **03:57:55**

**Michael Flynn:** Yep. So, we're going to bring it we're going to kind of get into 44 and do that for a new implementation. So, let's let's focus the right now on Shinasty and a rapid assessment like Shiny. Yeah. Or Shinasty was an existing implement outside the box like forget

**Imran Shabbir:** Okay. So, let's think

**Michael Flynn:** limitations for the moment.

**Imran Shabbir:** of

**Michael Flynn:** We may face limitations, we may not. China has given you a green light to proceed and said I agree you know I accept the loes here I would like to start working on these tasks maybe they give you a priority list maybe they accept our priority list what should our next step be like what should happen Next. Yeah. So in this real life example when the outcomes are not going to be straightforward, right? What what do you mean by when I say straightforward? Again, I keep going back to the newer implementation where it's more

**Imran Shabbir:** Okay.

**Michael Flynn:** configuration.

**Imran Shabbir:** In this particular example, for example, um let's say payout flow.

### **03:59:14** {#03:59:14}

**Imran Shabbir:** Okay.

**Michael Flynn:** That's still a simpler one compared to the customer

**Imran Shabbir:** One. Okay.

**Michael Flynn:** depos

**Imran Shabbir:** So we

**Michael Flynn:** flow in Siliggo. Yes. How can we So as of today we haven't done anything with Celiggo. So first let's do we let's work let's try to work through a netswuite only example. Right. Is there something that can be fixed? Is there are there some things that can be fixed purely by changing netswuite by customizing Netswuite? By properly configuring properly configuring Netswuite. So the big tasks were the two was legal.

**Imran Shabbir:** order customer deposit. I'm sure we cannot do that either because goes big picture. I think maybe we

**Michael Flynn:** I have not attempted to touch or do any of that yet.

**Imran Shabbir:** can

**Michael Flynn:** So I want to try and focus on what I want to try and focus on Netswuite just at the moment. At least as a a section, right? Yeah. Something we could test today.

### **04:00:26**

**Michael Flynn:** We could try to push forward with today. Let's go through the list. Oh yeah, I was going to say what's So this should have the list, right? You can see they're numbered here. Have to go through all the pages.

**Imran Shabbir:** the summarized

**Michael Flynn:** At least identify which is

**Imran Shabbir:** version

**Michael Flynn:** worth

**Imran Shabbir:** deposit e-commerce pay Amazon settlement I'm sure it's saying applies to Amazon right customer

**Michael Flynn:** eus.

**Imran Shabbir:** deposit payment link validation members portal returns and exchange Change reconciliation allocation

**Michael Flynn:** That's internal. That is uh

**Imran Shabbir:** uh netswuite specific. Yes link to that artifact.

**Michael Flynn:** Inventory sync icon counts month and close. Oh, it's in the AI summit. This is also net native prepayment evaluation.

**Imran Shabbir:** It's going to be

**Michael Flynn:** Yes.

**Imran Shabbir:** all

**Michael Flynn:** So my this is the delete the 44 pro

**Imran Shabbir:** I mean,

**Michael Flynn:** meeting the 44 pro meeting that summary for today just

**Imran Shabbir:** maybe

**Michael Flynn:** delete because it might have some previous comments.

### **04:02:32** {#04:02:32}

**Michael Flynn:** Yeah. Yeah. Yeah. Um two or three points which are just specific to netswuite they require more discussion with the customer. So there's no clear solution.

**Imran Shabbir:** So like for example vendor prepayments they don't use next week's vendor prepayment functionality they do some work around around it. Okay but you have to take a little deeper into it and then enable it. Sure. The dust. Stop talking about the food. Oh, it's just food. I know.

**Michael Flynn:** But delete it just in case.

**Imran Shabbir:** I'm worried about my point. So, I think that's a good point, Em. I

**Michael Flynn:** Are we even on the right track with like can it jump into some sort of

**Imran Shabbir:** like

**Michael Flynn:** executable now? So let's like one thing I can see which it can do

**Imran Shabbir:** is one of the item is clearing up or cleaning

**Michael Flynn:** scripts or if you see any scripts not being used or

**Imran Shabbir:** up. I mean,

**Michael Flynn:** executives

### **04:03:37** {#04:03:37}

**Imran Shabbir:** we're not going to do anything right now, but we can at least forget for a second. What

**Michael Flynn:** you light to go ahead um

**Imran Shabbir:** You don't have What are you doing next?

**Michael Flynn:** for this particular project I mean of Yeah, let's let's go let's go with these guys. Yeah. So, what's the next thing you do? Like be literal about it. Yeah. The order

**Imran Shabbir:** Review of the order placement process.

**Michael Flynn:** coming in and

**Imran Shabbir:** it in the customer deposit conversation.

**Michael Flynn:** fulfilling.

**Imran Shabbir:** Is the current design the correct one or should we move it to the customer deposit ones and change the integration and all that

**Michael Flynn:** So, you need to have a working session.

**Imran Shabbir:** stuff?

**Michael Flynn:** Yeah. So, are we trying to get into AI um moving forward with solving tasks somewhat? Oh, to some I mean or at least creating the framework. That's where I was going, but I actually think I'm going to back up and say my next question is a little more like fundamental.

### **04:04:50** {#04:04:50}

**Michael Flynn:** Like we've produced the sprint document, we've done the presentation. Yes. The customers agreed. Yeah. What next? Um and what role does it what role can some sort of AI assistant play in that moment? So, and I think Imran's point is good for an implementation. We need to get in there and enable features. we need to make we may have already identified some fields and stuff that need to be created. Um it's a little bit more repeatable, right? Yeah. But for an existing account, this is a this is not as obvious. So my question is what do we do next and what would you want out of an assistant? Yeah. And in many cases, you're on any of these specific topics, you're probably starting off with a in your LOE, you're starting off with a discovery session to dive deeper into the DA tales that you talked about on site or you talked about in your preliminary conversations. I think that's I think that's definitely True.

### **04:06:01**

**Michael Flynn:** Yeah. And and so maybe in tandem with that deeper conversation, this is theoretical, but then if you had kind of templates for, you know, for example, enabling supply allocation as an example, you know, or something like that. Now, this one probably isn't an enabling. So, I'll move to another project. We don't have to restrict ourselves to shyness. We might restrict our thought process, but another rapid. Mhm. Uh like rescue. Yeah. Yeah. Yeah, not implementation. I think we clear on the thing about another customer

**Imran Shabbir:** process. So I was

**Michael Flynn:** is grinds which is manufacturing,

**Imran Shabbir:** thinking

**Michael Flynn:** right? Got it. The very first task we picked up in that and we're still working on it. Uh was which required made creating few safe searches,

**Imran Shabbir:** ports which can be automated.

**Michael Flynn:** creating some report.

**Imran Shabbir:** So the issue is some context.

**Michael Flynn:** They they are a manufacturing company, right? Yep. Using legacy bombs and their unit of measures

### **04:06:55** {#04:06:55}

**Imran Shabbir:** Was

**Michael Flynn:** were not ideal. Okay. Like for example, they make batches of so they make pouches of coffee. I don't know. You have them? No. They're pretty freaking good. They're like they're like Zins, but then no nicotine coffee grinds. And then now they have like energy like 80 milligrams of

**Imran Shabbir:** that coffee grind? Is it just like energy pouches?

**Michael Flynn:** caffeine. You just like suck on it. You just put it in. It's like a chewing tobacco. You put in your lip like a fel chewing tobacco. Well, like a Zin. Yeah, but a Zin doesn't have any tobacco in it. It's just nicotine. No, it's just nicotine. You just stick them in your lip. Yeah, it's like skull bandits. But but it's just straight nicotine. No tobacco. I don't know any of these things. You guys, now the grinds is the grinds isn't even nicotine. It's just caffeine.

### **04:07:56**

**Michael Flynn:** How do you think I drove back from Massachusetts straight through one here all over the place? So yeah, unit of measure. Yeah, let's pick a simple one. So for example, they use um an item which is a liquid item. Yep. But the base unit of measure is grams.

**Imran Shabbir:** some reason they created in some you know and then they have conversion

**Michael Flynn:** They buy it in gallons, but they're consuming in grams, which is volume and weight, right? Not right. So weight is more accurate. Even if you're cooking, right? You're better off in grams than in volume. So no, but they're also consuming they can consume in milliliters in instead of grams. But but in some scientific way, you can convert gallons into grams. Okay? Right. So we eventually agreed that let's keep it that

**Imran Shabbir:** Instead of creating another volume and creating because you have to create a new item if the base unit is incorrect,

**Michael Flynn:** way.

**Imran Shabbir:** right?

### **04:08:53**

**Imran Shabbir:** Which loses the history and all that stuff.

**Michael Flynn:** So the the the exercise of pulling that list, identifying what They created safe searches.

**Imran Shabbir:** items or that was all manually in safe searches.

**Michael Flynn:** I created part of just pulling that

**Imran Shabbir:** We spent a couple of meetings going through it that first been automated and

**Michael Flynn:** data identifying the culprits would have

**Imran Shabbir:** once we agree to solution then we create new items. Okay. So I think

**Michael Flynn:** still that would have saved me I would say and them also

**Imran Shabbir:** that's

**Michael Flynn:** time. That is something I can ask Claude.

**Imran Shabbir:** that this is identified on the day one as a rep assessment to review the item master. Oh there's another thing item master we did um there

**Michael Flynn:** of items which they never use or haven't used in a long time.

**Imran Shabbir:** are and activate those.

**Michael Flynn:** So created safe

**Imran Shabbir:** So that that is something he did himself. That's a great one.

**Michael Flynn:** searches you know went through it uh again that can be automated if there's no transaction you could extend that say entity fields you know I'm sorry entities like uh vendors we haven't bought from in more than five years items we haven't sold in five years yeah something like that we have no stock on

### **04:10:06** {#04:10:06}

**Imran Shabbir:** another example I think can be automated. Yeah. So I want to kind

**Michael Flynn:** So, so how what is the command we're giving in that case?

**Imran Shabbir:** Hey,

**Michael Flynn:** Is it listen, you know, go back like is that would that have been a task that would have been called out by this process already that we could just say go do? Would that be a t like if so is the is the command just saying hey we've prioritized this go ahead and take on task 23-11 or I I I don't think our in this ideal this is all very subjective in this particular case the the rapid assessment document starts with like a big picture identifies a issue recommend a solution then it requires multiples for example in my report it was review of item master review of unit of measure um and use correct conversion now that isn't a

**Imran Shabbir:** full

**Michael Flynn:** specific enough task for AI to go run it and I have to create subtask do it in the document I don't think so that will take

### **04:11:19**

**Imran Shabbir:** asking now.

**Michael Flynn:** forever to build the document so this So we could take the highlevel task and you would say I want to dig into this task today. Yeah. And it may lead you through some discovery. It may lead you through some additional questions and then ultimately you get to a point where you have a decision on a solution and hopefully you can hand some of that off to that possibly you end up in a spot where you need to schedule a follow-up meeting to get more information. Yes. But which part are we automating? I think there still needs to be maybe I cannot visualize it at this

**Imran Shabbir:** Mhm.

**Michael Flynn:** point.

**Imran Shabbir:** I think there has to be after that initial

**Michael Flynn:** human and high level task.

**Imran Shabbir:** release position with or any of us have to the

**Michael Flynn:** I have to have a

**Imran Shabbir:** claw that okay this is a task I'm working on. Yeah. In order for me to start t the steps of this the very first thing I need is to list of

### **04:12:33**

**Michael Flynn:** working on like five

**Imran Shabbir:** items which are not being used in last six months. Okay. I need list of items which have

**Michael Flynn:** m. How did you decide that that's what you needed? That's what we agreed on. Right. That's what I said. that was agreed upon in the assessment sessions to clear the noise and and activate the unused ones or ones which have not been used or will not be used in foreseeable future. Okay. And so hopefully that that was captured or even if the high level it there's it understands where that came from and can go back. So are we at the point where we've c And

**Imran Shabbir:** this document. We've got a task in somewhere.

**Michael Flynn:** we're talking to Claude about that like

**Imran Shabbir:** That task. We have a task at this high level.

**Michael Flynn:** don't assume anything that we haven't seen it produce roughly to this point or at the at the level of detail we've seen it be able to produce.

### **04:13:39** {#04:13:39}

**Michael Flynn:** So if I you have that task and now Iran's in there interacting in the task just say well I I actually we started from a more fundamental place than that is simply like what do we want what do we want to do next and how do we want okay this involved like the report is made let's say we agree with so first part of any project uh engagement is what we have discussed the last few days right uh pre-sales and the notes and the formatting and now let's say everything is you've presented. You're done. You're going to kick off the presentation call. Mhm. And now they're saying, "Yep." Okay. Now, how do you pick task and what part AI can automate? It's very fundamental. In this

**Imran Shabbir:** You couldn't do anything because everything either requires illegal or Shopify takes another

**Michael Flynn:** case,

**Imran Shabbir:** step.

**Michael Flynn:** yes, sorry. Maybe just work on

**Imran Shabbir:** So there's no portal but you you're in cloud you've generated this now you can say okay I want I

### **04:14:36**

**Michael Flynn:** task 24-1.

**Imran Shabbir:** want is this to

**Michael Flynn:** Let's dig into it a little bit more.

**Imran Shabbir:** build up kind of a library of Hear it.

**Michael Flynn:** Really, really common stuff that are going to be, you know, happening in a lot of different environments where you could have this built up to where it can already start that whole process. No, I'm not necessarily like I'm trying to figure out what it is we even want it to do and how proactive we want to to be and how much of it can it just run with versus us sitting there working. Right? If we go back to to yesterday and we said what the initial goal was, we are most valuable when we are working with the customer guiding them towards decision making, not turning the nuts and bolts. Yeah. How? So, I know that that cannot be a 100% of our time is spent on doing that. I don't think we're at the point where that could be 100% of the time. But what can we imagine it could do for us that would give us more time to be doing that side of the job that we all agree is more valuable than just turning nuts and bolts.

### **04:15:55** {#04:15:55}

**Michael Flynn:** You know, this sits somewhere in the middle. If this is helping us brainstorm and you know saying hey I just need a list of go get this list for me then that is doing that is moving the needle right because it is I'm no longer going into Netswuite right trying to figure out what the safe search parameters are right exporting that data or just telling cloud to go get that data yeah and then do evaluation on the you're basically prepping yourself to to decide what's being to be done. Yes. And then when you get there, you might either get there and say, "Okay, go do it." Right? Or you go you get to a point where you need another call and you go do it. So what I don't think is really isable is to just

**Imran Shabbir:** It's feasible or likely or reason.

**Michael Flynn:** say, "Hey, the customer said we're good to go on this. Go do it all." Yeah. We know we know there's going to be more that needs to happen. There may be some there might be a couple tasks

### **04:16:50**

**Imran Shabbir:** Well, there could be some features that

**Michael Flynn:** enabling that uh that have a little bit of complexity in normal housekeeping you have to do when you enable them that still require their prerequisite conversations like supply allocation supply allocation supply allocation when you turn that on you got to run the tests to make sure their data is acceptable error you don't have to contact support then you got to deploy Then you have to go in, if you're doing it well, you go back in and update all of your forms because it just throws those fields in there, the sublist and they're not in any particular order and they're like way at the back of whatever they were. And so you you want to bring all those into a logical sequence that's really consistent. So they see, oh, got it. Now I understand there's allocation, there's how many days late, here's my expected receipt date, my supplier card, but they see all this in some sort of a logical sequence. To be fair, that can be done here. Exactly.

**Imran Shabbir:** tell it, hey, I've or enabled this feature.

### **04:17:52** {#04:17:52}

**Imran Shabbir:** Then you need to go move those fields over. Exactly. That's my point. You could that

**Michael Flynn:** kind of thing. You could say, "All right, as long as I satisfy my prer prerequisites and I understand there's no danger of turning this on all the normal stuff. Right. Yeah. But I could say go enable supply allocation and update all the transaction forms. Right. So let's try this. I don't think this is how we were going to ultimately do this. Let's just ask cloud what customers agreed to move forward with this project using MCP and SDF connections to Netswuite. Which of these tasks can we just go ahead and execute on? Let's see what it says. Yeah. Yeah. Yeah. Oh, sorry. I shouldn't be talking while it's NSDF. Oh, he's typing that. I thought it was taken from his ver. I was like, it's going Justin doesn't type anymore. I I I I shouldn't.

### **04:19:01**

**Michael Flynn:** It's really easy. That's all you're asking.

**Taha Raja:** My thought

**Michael Flynn:** Am I about you? Yeah, that's true. Yeah, they'll figure it out.

**Taha Raja:** you

**Michael Flynn:** I don't use whisper flow as much as I should. It's so much easier. Like workflows is another one. You can just say workflows is another one. Like approval workflows. Sure. Yeah, just be executed within Netswuite, right? It should be able to build an approval workflow because I believe you can roll out Netswuite sweet flow via SDF. Yeah. So I think it's very tough. So it might just decide to write a script instead. So okay, that let's talk about that. Let's talk about why do we care? Or better yet, I mean, I I think I know the answer partially, but is one way more desirable than the other? Is one way more efficient than the other? Um, if we are able to do it via SDF, do we just lean that way?

### **04:20:09** {#04:20:09}

**Michael Flynn:** If it's if that means it has it is done via script so I I so this has always kind of been my and I'm a geek so I would lean scripting by the This is where I've always weighed on this is first question I said is is is this something that the customer may want to go into the UI and tweak themselves? Is there like departments they may want to add to the approval flow or something like that? And if so, will they reasonably be able to do it themselves if I make it a workflow? If the answer is yes, if the answer is no, I tend to go with what's fastest and cheapest, which used to be can I do this in 30 seconds myself with workflow or do I got to do a use case and turn it over, which probably is not the right. It probably needs a use case anyways, I guess, is what I'm saying um yeah, I think that's fair. So, let me go back to the first question. The first question is probably where I would my instinct is.

### **04:21:09**

**Michael Flynn:** I'm interested in what everybody else thinks, but if the customer is never going to touch this no matter what and is always going to come to us for support to support it, I'm going to do it the way that is easiest, best, and simplest for us to run. I don't know this for a fact, but my belief is that you can make a script far more efficient than you can make workflow. Workflow tends to be like a Rube Goldberg machine at times to get stuff done. So I you said exactly what I the customer interaction should uh is going to go read the script and I think that's our script, right? Read script source. Yeah.

**Imran Shabbir:** Thanks. I always go the same way. If customers need to interact with it and add

**Michael Flynn:** conditions,

**Imran Shabbir:** users

**Michael Flynn:** whatever. And capable. I think it depends on what those things are because you can just as easily create a parameter or a script to list the departments. Good point.

### **04:22:14**

**Michael Flynn:** Or a threshold or a dollar threshold. Or you can make a script call a custom record that you put on that customization. Yep. So I I think I think the the reason Workflow existed was pre- AI and pre all this stuff. Sure. Which I would have leaned towards Mike. Yeah. I think I think that I would have leaned towards workflow in those situations, but nowadays I'm not sure because I I would have leaned towards what Mike said because even though I have a scripting background, it would take me longer than to do it in a workflow and I can likely start with a base workflow from a from like approval workflows and and add to it or tweak it. Now, now if I can just talk tell explain the problem and it's going to create a script and I understand that hey if I need a parameter or if I want to make it user friendly and user editable and whatnot that's actually a good idea a custom record for the configuration settings is perfect.

### **04:23:15** {#04:23:15}

**Michael Flynn:** Um then no I don't think you're anymore going to lean towards a workflow because you want user user interaction. Yeah, I agree. I think I think I It's right efficiency. Yeah, I mean I think I think uh you know the usefulness of a workflow with AI is going to diminish greatly. Uh you know I mean like the pricing updates like right we talked about Brixton how they have twofold. they have some vendor pricing that is too long precision, right? Like it's like four four decimal precision. And when they when that gets pulled into a PO, they don't like the way it looks, right? So they want now you could round it on the PDF and fine but they don't like it in the UI. So, they want it rounded. So, I said, "Okay, well, just we'll create something that update the item record when you save it. It'll round the vendor price to two precision." Done. Yeah. But that could have been done in a workflow most likely. It might have been a little difficult to trigger when it doesn't need to do anything, but it could have been done in a workflow.

### **04:24:24**

**Michael Flynn:** And that's goes to the efficiency piece of it because a script can tell do I need to perform this action. A workflow just does it. Well, you can put conditions in. You can. Yeah. But it's a lot harder to figure out the precision of that. Yeah. Value in a script. It just you just do it. Yeah. Yeah. Length done. Um but now they came back and said, "Okay, but yeah, not all of our items have the vendor pricing. Sometimes we load them in on a CSV when we upload the PO. So it has to be rounded on the PO as well. Now again, like that's that was two scripts and it wasn't that hard to do like at all. It probably took me just as much time to do those two scripts even with all like the the planning and the use case and the planning and claude the the the deployments the account setup s\*\*\* like that as it would have took me to create two workflows and I was way more confident doing it in cloud with the script.

### **04:25:21** {#04:25:21}

**Michael Flynn:** Yeah. Yeah. Because now that might just be me. No, because I know what the scripts. That's what I'm saying. I think in the in the world of AI, I'm not sure that the workflow interface will even exist once the Netswuite AI becomes intelligent. Yeah, because I mean, think about it. Why would you want to mess it that way when the built-in AI will just do it for you? Good, good point. You know, so so it did go through it. It read few scripts um identified what it can work on but

**Imran Shabbir:** When they say work on still requires or anything

**Michael Flynn:** again

**Imran Shabbir:** requires

**Michael Flynn:** discussion with customer first of all uh okay let me start from the top is

**Imran Shabbir:** good question here um

**Michael Flynn:** fully automatic end to end for two structural reasons no sand

**Imran Shabbir:** not box access exists yet and the connected MCP role is read only and that's a hard rule not a

**Michael Flynn:** Not sure that's art.

**Imran Shabbir:** preference.

### **04:26:29** {#04:26:29}

**Michael Flynn:** I think uh I think we put that into our claude MD file to make sure that I think it mentioned somewhere that during an during the beginning of an engagement we're not changing anything but the same pattern cloud MD uses for the script reader tools.

**Imran Shabbir:** So, so this is the role we they had already created, right? We just used their remember. Yeah. Oh, we used their role.

**Michael Flynn:** a condition in your role,

**Imran Shabbir:** I was going to say is that

**Michael Flynn:** your your MCP. It's not an actual limitation in my MCP role. Uh, I do think I have it in the assessment project instructions the cloud MD file I do think it says makep read only use MCP read only I think we used their role already built cloud we might have which maybe is part of the problem why it keeps giving us errors okay the and then these are the things identified um so one thing the NSAPM performance data pull. It was on the end of the first task there. Yeah, I just tried to do that.

### **04:27:35**

**Michael Flynn:** I don't think I don't think Claude can read them. Unless I just unless I just didn't ask it enough. Okay. Because when I asked it, I did I asked it to do that for temperaments to see if that could answer the concurrency and and their configuration. And it basically told me that the data on the APM pages is all sweetlets. Yep. So you have to it can't grab them. it. So it asked me to go to the page and and I basically took screenshots of of the the sweetlet and pasted it in and it used it and it was like okay this is good this is what I need but it wasn't able to just get it. No interested and that's where the ACS comes in the presentation they did to one of the customer they have like a very detailed maybe and net has some tools in the back end where they can pull summarized which script failed after we got out back from

**Imran Shabbir:** Well, maybe I just needed to challenge it.

### **04:28:26** {#04:28:26}

**Imran Shabbir:** Well, this was last time

**Michael Flynn:** dinner and I spent 20 minutes on it you know what I mean because I was able to go and copy it and it and

**Imran Shabbir:** use the information.

**Michael Flynn:** it's figured fine and it's their scripts and they're tripping

**Imran Shabbir:** It basically said that they're conf

**Michael Flynn:** all over each other which I think we do. Yeah. Yeah. Well, point being I told me it couldn't pull it via the MCP and I just didn't know if anybody knew different. I I I don't know off the top of my head, but yeah, I guessing it's correct. Yeah. So, RF Smart was one not verifiable

**Imran Shabbir:** MC MCB needs direct answer needs early confirmation

**Michael Flynn:** building not something I can in

**Imran Shabbir:** before for yeah all of these nothing is I mean they were saying the same

**Michael Flynn:** not put next in the scripts are actually not 200\.

**Imran Shabbir:** So actually 658 likely 700 scripts in the

**Michael Flynn:** description. So, it reviewed few scripts and it's asking if we want it to go read more.

### **04:29:47**

**Michael Flynn:** I don't know that we nec I think that that should be more targeted.

**Imran Shabbir:** Um,

**Michael Flynn:** Like I don't think I'd ever want to just say, "Hey, go read every script in the system." Um, that's what it said. Peppermints might be an exception to that because we did like we kind of did just tell it to go read a lot but like why is it reading these scripts right it should have a reason that it opens and reads the script and yeah so pick the ones which were like you know related to the top tasks so I I a

**Imran Shabbir:** I think maybe this is still

**Michael Flynn:** spot where we are going to have to decide along with the customer of what the first bullet point we're actioning on and we want to come in and say hey we are going to work on X well that conversation would still happen anyways right the customer will decide their priorities and all yep I I think so I think that's right but I I think even when it come okay so let me say it a different way like what I am envisioning then is Still, when it comes time to execute work, we we go into our tool, our interface, whatever we have, and we explicitly pull a ticket number or a task number and say, "It's time to work on this. I want to work through this." Um,

### **04:31:25** {#04:31:25}

**Michael Flynn:** I think this is is our food. Hello. Sorry. Thank you. I'm there's a customer who was very confused by I'm Ron. That's Imran. I think the issue is with Ron because he always says I am Ron. You guys said Ron, right? He said I am Ron. I'll say Oh, you run too. Nope.

**Imran Shabbir:** And now I'm wrong.

**Michael Flynn:** Who's on first? that have. You remember seeing that this company what blown up like all the hardies? Yeah, there was that was that went Oh, this is Houston Costella. There was a there was a Chicago Cubs player obviously Asian. His last name was who? Huh? There was a picture of him on first base. Okay. Started a food truck in University of Houston and now it's completely blown up. Yeah. The food is so good. Yeah. One of those first Dr. Jam movies, too. He was Rush.

### **04:33:48**

**Michael Flynn:** The whole I'm getting a new

**Imran Shabbir:** Who are

**Michael Flynn:** Rush.

**Imran Shabbir:** you?

**Michael Flynn:** We are. The president insisted they make a sequel. Really? Are you serious? No. It's the way it's been reported. A clown. I have not heard this, but it wouldn't surprise me. Oh. So God said he wants a meeting with me.

**Imran Shabbir:** Okay.

**Michael Flynn:** It's probably related to the hours that we talked about most likely. So just put that look like they were all Shopify stuff. So just as I said there is some Amazon stuff too. So, just make sure you Oh, maybe it was Amazon stuff. Sorry. All right. All right. Um, is there any other way you can send me some of the time and

**Imran Shabbir:** That's not I I couldn't see some of

**Michael Flynn:** actually it it looked like it combined um some of the comments

**Imran Shabbir:** them.

**Michael Flynn:** on certain dates because I saw like 622 just below.

### **04:35:16**

**Michael Flynn:** Oh, did I Were those your fries or mine? Yeah. I just didn't get them. All right. I mean, you can have some of you can have these if you want. I'll just take I'll take a look and see if I have um but there was like there was comments on a certain date that it was so jumbled and I tried to read a couple of words and none of those words were even in my time stamp that day. Okay. You know what I mean? So I was confused on what it was even shown. go back to the and I didn't know if like the invoice would combine comments for a certain day because it looked like it said developer and consultant but I couldn't tell it was so it was overlapping. political involvement. The revival of the franchise is notably attributed to US President Donald Trump who personally requested the studio bring back the series. Ratner, it's a Brent Rner's the director who previously fixed misconduct allegations and severed his ties with Warner Brothers will be brought back.

### **04:36:31** {#04:36:31}

**Michael Flynn:** Sounds like the red card issue. You know what I'm saying? Like, hey, you know, that was stupid. I mean, honestly, like I think I think that affected the morale of the team in many ways and we could have I think it got weird. It got weird. Yeah. For them. I think I don't think it should have been a red card anyway. I didn't think it should have been a red card. I don't I don't think you should have been comfortable with the way it all went. That's what I'm saying. It's like, you know, I know it's it's it was a questionable call, but questionable calls happen all the time in sports, right? you you're set that precedent where the president of the hosting company country and just say you know what that was wrong you need to change it well well and and I think it did two things it caused kind of a weird situation with the US team and it probably extra motivated the opposing team to say I'm we're going to beat the s\*\*\* out of you now it's like the classic locker material.

### **04:37:27**

**Michael Flynn:** Yeah, exactly. Exactly. Again, I don't I don't know that we're going to get past that game anyway. Yeah, I don't think so either. No, but you know, it would have been it would have been nicer to have not this part to be play a role in Well, it's like it's like the classic thing. It's like don't give them bullet board material before a big game. Well, the especially the the kid who got Yeah. Like he was the best player on the field for the US by far. Like by far like he was the only one that looked like he belonged on the field with those guys. Holistic a little bit, but he didn't really do all that much. Yeah. Got hurt. I believe I love Landon Donovan's comment. Was it Landon or I got like you would have had to drag me off that field. No effing way I would have left at halftime. I know. What's her name? Uh player.

### **04:38:19**

**Michael Flynn:** Yeah, she was pretty critical. Carly Lloyd. Mhm. Like, well, when it comes to American, she's the only one they should let talk anyways because she's the only one of these people who've accomplished anything. Yeah. Alexi L is an idiot. Yeah, he is. I absolutely love I loved him in Spin Doctor. I loved looks like the lead singer. the fact that like Zlatan and not even so much Jerry Henry but Zlatan tore him up every single day himself right yeah but it's funny all right like it's funny I don't think he's ser he probably is serious about it but Dear. is, but it's it's actually very good. He was very good. Oh, yeah. But he's it's entertaining. Like Alexi Law did nothing like Yeah. It's not saying you can't be a good commentator if you weren't, you know, no an allar. No. But when your mentality is uh holier than that, then it's kind of hard to hey, you weren't a star, then it's kind and especially when the criticism comes up about the US system and how much money it cost and he's the guy who chimes in with, hey, it's capitalism.

### **04:39:36**

**Michael Flynn:** There's money to be made. Like and you're like, well, there you go. There's the problem exists. Like soccer is the sport of the soccer and cycling. Some of those are the sports of the underclass like what NFL football and in a large part of baseball and basketball are in the US. Now soccer seems to fall more in line with lacrosse and sports like that whereas people with means can have their foot. It was kind of crazy with soccer because when you think about it from a gear standpoint, it's like so much less gear than like football and baseball. Well, it it is, but that is the reason it's a global sport. Yeah. And so one of the main reasons anybody without any resources can still play throw the ball out there, find something to do. And in in East Africa, they don't even have balls. What they do is they take plastic they take plastic bags and they put a rock in between and then wrap the plastic bag so it turns into balls and then they make with it like every other sport like if I want to I don't know even cricket is expensive everything you need something basketball is really there's a lot of public infrastructure to play basketball not in Africa you hear about these baseball players growing up in the Dominican Republic literally having a a ball of tape yeah that they That's why like I know a lot of kids in my town who spend a lot of money on baseball.

### **04:41:10**

**Michael Flynn:** I'm sure Gordo takes a good amount of it. But uh and all I look around is saying like, man, you guys put so much effort into this. Bunch of you aren't even going to play in high school. And then those of you who are going to play, like there's some Dominican kid who makes no money who just would kick your ass, right? Yeah. How are they doing it in Dominican with all these people? I mean, they're playing in a much different way or what do they do? Because baseball is not cheap either. They just play on they don't use they don't they play like you're talking about soccer. They with a paper plate on their hand for a glove. Wow. Or nothing. Yeah. And like sandals strapped to their feet for shoes or no shoes. I don't know. a lot of. So now it's probably different because a lot of those uh a lot of the big leaguers will send stuff home like a lot of stuff and they have development programs uh affiliated with the big league clubs in Dominican.

### **04:42:12** {#04:42:12}

**Michael Flynn:** So like those kids are in a program like 13 14\. They're grooming them already. Yeah. Like when I played I played with Miguel Cabrera. He's from Venezuela, but they signed him when he was 16 years old. He played 280,000. Now, he was the best player probably I've ever played with. And he was 16, chubby. He played shortstop. Like, you knew damn well like he was going to be good. And the dude played until two years ago. Wow. Like this is I'm talking this

**Imran Shabbir:** like I played with him That's

**Michael Flynn:** is playing. That's crazy. You could have been playing until two years ago. Last one to last one to hit the triple up front.

**Imran Shabbir:** stuff.

**Michael Flynn:** Yep. You know who we played golf with? I told you I played Temp. But do and uh you know Ryan O from where was he? uh the school he's from Mass, but he played he pitched in the big leagues for the Twins.

### **04:43:11**

**Michael Flynn:** Okay. For like four or five years. Yeah. Pro Valdez.

**Imran Shabbir:** When they scout

**Michael Flynn:** I remember them saying him out. Um they had to they had to turn on the headlights of their rental car

**Imran Shabbir:** down,

**Michael Flynn:** to try him out because there was no power where he was. So he couldn't and it was night time when they got there. So they literally were having him pitch with the headlights on watching him throw. Yeah. But that's the point too. Like even like you look at cycling which cycle bicycles cost a lot of freaking money. But in Europe they have these club programs where they literally the bikes get handed down handed down hand down pass through. So the kids as they grow then turn it back over to the club and get bike and the next bike. But it's still opportunity. So you look at in US where we've fallen prey to the advanced stages of capitalism and the problem with the advanced stages of capitalism is that is that making money ends up moving to the top of everything.

### **04:44:23**

**Michael Flynn:** So it's it's not that making money is a bad thing. But you look at health care as an example. Health care in this country used to number one goal used to be and number one priority used to be health care. Yeah. And now it's revenue and it had to be profitable but profitable might have been third or fourth on the list and now it's now it's you're a customer. You're not a patient. How do we and how do we make you a subscription customer? Um like even baseball travel like those kids that play for GBG are paying 3500 four grand for the year. Oh yeah. Now, you get equipment, you get training, you get all that stuff, but like that's a lot of money. And soccer, and people are like, I can't believe soccer costs this much money. It's like f\*\*\*\*\*\* half of what baseball cost. Like, I'm gladly. And it's all year long. Yeah. But yeah, Landon Donovan, I remember him saying he was like, yeah, my mom didn't have $400 to spare as a single mom, let alone $4,000.

### **04:45:25**

**Michael Flynn:** Hey, what did he come up with in just wreck leagues? And yeah, I think so. But I think I think club play and things like that were just a lot more. So back then in club like club soccer wasn't as big just like AU baseball wasn't as big. Uh and now it's everything. It's the whole pay for play thing. Yeah. Yeah. I feel like even when we were in high school like the biggest place to be seen was probably Legion ball, right? Yeah. Yeah. Legion senior like and then like I said AAOU started to come around when it was actually AAOU and there was one maybe two teams in mass if you play and you had a try out you had they only had one team at a certain age level if you just weren't good you weren't good. I remember like didn't play that well in high school ball, but he was like better in he made well he went to UMass, right? Went to UMass originally, then went end up at Nor Eastern.

### **04:46:22** {#04:46:22}

**Michael Flynn:** Um like he made the Enterprise all scholastic. That was probably because they knew he was good. Well, he Yeah, he hit well as like a sophomore or something. I'm guessing on the girls side it's at least slightly more affordable. I mean, depends which sport. Well, soccer's no different. Oh man, I mean I the one advantage they have obviously is that as it became a professional and international sport was that they had they had great success at the beginning and so they were immediately kind of entering the hopes and dreams of young kids right out of the gate. And um so that that always makes a difference whether it's a single star or it's a team is you know you look at the impact that the Michael Jordan title are we working with PSG at all but you still have access to the system.

**Imran Shabbir:** out of

**Michael Flynn:** So that probably helps.

**Imran Shabbir:** contact.

**Michael Flynn:** Not sure if we I haven't tried to log in forever. We keep getting the emails um you know just the what emails the net marketing ones for right now service.

### **04:47:28** {#04:47:28}

**Imran Shabbir:** I think they refresh the sandbox. Gotcha. Yeah. I

**Michael Flynn:** I mean that's an example where what's her name? Oh yeah I forgot her name too.

**Imran Shabbir:** mean,

**Michael Flynn:** She just dove head first into AI and started managing things herself and building her own scripts. PGPSorggan. Yeah. And then what happened? Is it still she's doing? Yeah, she's doing like she just has she she dove in like right away even free AI like to like learn like we showed her how to do an import one day and we got on the call the next day and she like I import all this and I imported this and I imported this and I was like what if she messed it up you you were like terrified that the customer was doing their own work it was like we get more work but she didn't she mostly did everything it was so funny because PSG and RMR the both the projects were active at the same time couldn't be more opposite opposite Sale of two cities for the other lady.

### **04:48:34**

**Michael Flynn:** We have to explain one thing. Five explain it halfway and she'll figure it out the

**Imran Shabbir:** Is is the documentation task alone?

**Michael Flynn:** remaining six months to fix a docking station. this barbell. She went not working. Barbell seems like NASA compared to these people. Delano left. What's that? Delano is not there anymore. Where? Barbell was supposed the black kid that was supposed to take over for Tammy. Oh, okay. Tammy's retired. Retired but still working. She's still working supposedly till October. But was supposed to take over. There was somebody in there when I just went to the bathroom. Dude, we went out there one day, me and like an entire day or day and a half with the guys in Nashville, their new warehouse manager, and went through all this stuff and he was like, and he was kind of cheesy. He like had a story for everything, but he had some warehouse background. He knew Yeah, he worked at Ashley Furniture.

### **04:49:42**

**Michael Flynn:** Yeah, he he knew what he was doing. And then like a month after we did that trip, he was like, "Oh, yeah, he's gone." I saw that coming. You know why he was gone? probably because he knew what the he was doing and Steve cut him out. Oh, yeah. I was I was gonna say one of two things. He actually knew what he was doing or he wouldn't stop telling stories. Well, I think he knew what he was doing and Steve saw the writing on the wall and saw his saw his life go away and and to be honest, Jason probably got in an argument with Steve because Jay was not like I could see him doing that. Yeah. And Steve would probably Steve probably came in and was just like showed up in his ripped jeans and at 11 o'clock with his California attitude and was like, "You're going to do it this way." And Jason was probably like, "Nope, that's why it's all I'm not." They butted heads and he's gone.

### **04:50:34** {#04:50:34}

**Michael Flynn:** Well, yeah. Whenever you have someone that is countering stupidity with logic and reason, whoever's whoever is the higher ranked is the one that's gonna stay. And Steve's Yeah. Phil's buddy. Yeah, that place is a still a dumpster fire, but whatever. Hey, 44 Pro, I just sent you a detailed email with new copies of the invoices. And in the email body is kind of the email thread, right? So, you know, draft something up so that we can respond. I'm going to also reply to Rod mentioning that this was part of our topic kind of proactively managing that process. What was that lady's name at RMR that I blocked it out? She was the accounting lady. She was completely fixated on you. Wasn't she the boss? Not really. No, she was like the CFO, but she was like the least financially aware. She was someone's boss who was the least aware person. Like Emily was definitely above her, but And her name was Ann.

### **04:51:45** {#04:51:45}

**Michael Flynn:** Yeah. And she like accounts are usually very exact when they say the word like cost or things like that. She was not. And it created like mass confusion like yeah they probably shouldn't have been sold that way. Okay. So you you did confirm basically with him that it's I did but obviously I wanted you to take a look and create a more detailed explanation in support of any specific conversations that you had with meetings and all that. that way you know he can we can be out there I can't promise you that it explicitly came out that this is not MSP yeah um but I also can't tell you that I didn't you know what I mean I think I've definitely had those conversations you know what I mean so I I will look yeah nobody on oh I see He came back. He said, "We had the Amazon channel and the different markets during implementation. That should have been done during the original implementation." That's not the case. That's not I'm not aware. No, I I'm not aware of if they had Canada, Brazil, and and find out when it got started.

### **04:53:11** {#04:53:11}

**Imran Shabbir:** You can also

**Michael Flynn:** That That's fine. I can I never even heard that they had these markets until later. So, but we can directly contend that is facts with the fact by looking at the Amazon and saying when the store started. Sure. And that fixed that even doesn't even mean that it's he said she said it's like Amazon is telling you you even started it after we went live or whatever you know like you can even look at the first order when it first came in in Amazon Mexico in Canada that tell look if if it was started in January or whenever we went live you should have had orders in there I mean I have a lot more sympathy is I mean it's just crazy how their decision to not go all you can eat is biting them in the ass immediately like the second they signed their renewal. Yeah. Exactly. Like this whole issue where they refresh the sandbox and it would have mattered. We would have taken care of it.

### **04:54:20** {#04:54:20}

**Michael Flynn:** But now it's going to cost them 15 20 hours. Yeah. Exactly. So whatever. Again, this is shortsightedness, right? All right. Hey, I know you have a you have a call in an hour. Yeah, 15 minutes. In 15 minutes or 45 minutes, but I like the top of the hour. I need like 10 minutes to prepare for it also, but I So, I think we've hit a point where we've got some brainstorming to do. Yeah, I'm still letting it work through the 44 Pro to try to set something up. Do we want to just hit the pause button here and let everybody go get some work done and focus tomorrow on how can we tomorrow should be all about actionable actionable actionable. How do we make things actionable? Yeah. We've we've we've done the we've done an assessment. We reviewed tasks. We know what's coming. How do we action on it? Yes. Yeah. Using AI.

### **04:55:20** {#04:55:20}

**Michael Flynn:** Yeah. uh how do I see in the Amazon seller central when a specific just look at the orders that have come in first as a starting point and then go to their setup company information everything right just go through the menus and see what evidence you'll find to say hey this store started at this point oh wait is my oh okay so when you say actionable we are still referring to both um rescue projects and new implementation. Yeah. So, and just to wrap it like I I I agree with what you said earlier like there's a very obvious step one and even maybe maybe two but although maybe not there's a very obviously step one in implementations where we want to turn features on and I would say like two three four get the best setup form setup although I I would argue that maybe we still need to go through one specific speific like work session before we finalize that. But but the outputs of that work session 100%. We are then configuring forms, making fields, possibly even there's enough there to have it just go create custom records in some cases.

### **04:56:38**

**Michael Flynn:** Um that might be true of rapid assessments as well but the key there is we need to start executing work sessions before that. I think I was. Yeah. And do we want it to do something where prior to us starting those work sessions, it evalu valuates the tasks and tells us we need work sessions for this and here are the 10 15 questions you need to make sure you answer along with other things as part of that discussion. I would pivot a little bit differently. I would say let it ask questions and then the consultant says in order for me to answer these questions we got to do a work session. Gotcha. So you in order to do that you probably have to tell it what you're going to work on first though then still right you say okay I met with a customer the customer says these are the first three tasks I'm going to start with task s x xyz yes let's plan how to a plan of attack for this I think we want to have that manual level of control at this stage yeah I don't want it to completely decide on its own because I just don't see how the AI will have all the context I think that's Right.

### **04:57:53** {#04:57:53}

**Michael Flynn:** I just want I was trying to think of what the interaction should look and feel like. Yeah, there's definitely going to be need to be more detailed context probably even customer input and discussion. So in the planning stages if it asks very pertinent questions it's possible the consultant already knows and infers. If it doesn't it can say pause and say we're going to do a followup and you're going to feed more information into this finish up. We have to break down. I think we can automate a lot of execution of

**Imran Shabbir:** part. Yes. But the planet

**Michael Flynn:** execution. What needs to be executed? When needs to be executed with some more input. Yes. Is is the human in the loop. Yeah. Because what what's going to happen? We do we give it to AI. If something gets screwed up, then we're going to be in a problem. Well, isn't that what we're doing now? Like if I if I've got a scripting project or task and I open up cloud code, I do the plan.

### **04:58:48** {#04:58:48}

**Michael Flynn:** I present it with well first actually I go to first actually I go to the use case generator and generate the use case yeah okay based on the whatever blurb I have then I take that and I go to cloud code and I say here's my use case I need you and I put it in plan mode I need you to create me a project for this whatever whatever now it knows it just does it right um I'll create a git it'll create a git project and whatever um but that's the whole planning aspect And then once I'm done, like the implementation plan looks right and I'm ready to say, "Yep, go ahead." That's where we just hand it. Yeah. And and again, now with the deployment and SDF, it's like, "Okay, I wrote the scripts. I'll look at the scripts because I'll know at least a little bit if it's like blatantly wrong. At the same time, it's in sandbox. Push it into sandbox. And if I test it and it breaks, it's just wrong." Yeah. Yeah.

### **04:59:43** {#04:59:43}

**Michael Flynn:** Um Yeah. But that's now I don't know. Are we expecting it to be more hands-off than that? No. No. I I in the execution piece I want to be extremely careful because we're touching the customer's system. So I think right now at this stage I wanted to us to be involved like a you know you almost like instead of you spending an hour and a half creating fields and scripts at least that cuts that part out. Yeah. But that doesn't mean that decisions and the strategy and all that is away from you. It can't be because the strategy was partly derived with AI's help anyway. But then this is the human loop that says okay this strategy I want to approach it this way versus that way you know uh because even a script I've noticed like I said yesterday I've noticed that if you give claw this card to launch on to create and I said it'll catch the ear this way and thinks it's great. Yeah and that's the problem there is that with script and stuff like that unless you have some knowledge of what to catch you're not going to know.

### **05:00:52** {#05:00:52}

**Michael Flynn:** Oh, but even even the approach, right? Sometimes even if the plan like sometimes it'll come up with a plan and I was like, uh, why did you think of it this way and then when you give it some additional content? Oh, yeah. You know, it's like as if and then it backtracks on itself like as if it like you know, it knew but it almost Yeah. Hey, good catch. I Yeah, good catch. You're right. Oh s\*\*\*. It's like, well, to be fair, if you do that at the planning level, then you're right to do it. That's right. Yeah. Yeah. But I importantly I think plenty some of it with mata does in her email also customer I told her don't make it so long emails and do all this stuff. What's it what like give you an example I mean I can share this with Stefan the discount conversation but that's a good catch you did. Thank you for looking into it. I'm sure she's reviewing it sending it but these are long emails.

### **05:01:44** {#05:01:44}

**Michael Flynn:** Yeah but you know uh but give her guidance. I I give it to Babes. No, you you can also tell them you're a colleague of Viz and you are the responsible for customerf facing interaction. I told her I haven't Yeah, but both are in the No, but I mean you know because remember at the end of the day the US facing consultant is responsible for customer relationship not the developer. So if the developer is making some kind of an issue that could cause us problems it is your responsibility to say hey and if you feel uncomfortable bring it to our attention ASAP. Of course. Of course. No, that's nothing like significant, but I'm just saying now when I see reports and everything, I'm sure everyone can tell. So, they did have Amazon Canada and Mexico before go live. Okay. There was very little activity and it never ever came up. Like I I mean I don't even I don't even think it's worth going back and arguing this point, but it was not part of the initial setup.

### **05:02:49** {#05:02:49}

**Michael Flynn:** Well, but I think we can bring it up in the context of Rod, we went through go live, we went through UAT in six months, and you just brought it up. Nobody has brought this up and I'm sorry but we because it's a separate store we didn't look there because it's not part of it's you you have to even log in and navigate to a separate store like if you are operating in the US store you can't see Mexico you actually can no you only see it in the initial dropdown when you log in but once you are operating inside the transactions of the US you don't see the Mexico ones it doesn't it tell you when you first log in and say which context you want to start so I here I have Um, hold on. Because on mine it it it doesn't allow me to do that. I'll just show you what I'm seeing. I'm not saying it's not doing what you're saying, but I'll show you what I'm seeing. I have Canada picked at the top level.

### **05:03:44**

**Michael Flynn:** Yes. But if I click into the menu and go manage orders, I get all of them. Ah, that's all I'm saying. Okay. So, but again, I didn't really I didn't know those existed. Yeah. Because we never we it never came up. We never talked about it and I I hate to keep popping on this, but they're the ones that cut the road short because they wanted to go live. Like this has been running for six months and you never brought up Yeah.

**Taha Raja:** Canada, Mexico,

**Michael Flynn:** There's no no sales in Brazil.

**Taha Raja:** Brazil.

**Michael Flynn:** There's 51 between Canada and Mexico. And the only complaint that he ever had was I don't get a settlement from Amazon and Mexico. And it's like, well, well, yeah, because I didn't even know those existed and they're not set up and it needs to be it's a whole different set of flows. It's a different integration essentially because you have to connect separately to Amazon for that. It's not a different license.

### **05:04:39**

**Michael Flynn:** It's the same license. You can just add stores. That's what I'm saying. But you have you pay for stores and they don't charge you for it. I thought they charge for it. Amazon. I don't believe so. But it it adds to the number of flows that you're using though. So it's not a new endpoint I don't believe. Okay. Same endpoint, different number of flows. Okay. You know, so if you have 15 flows and you have 10 stores that use four flows, you need more flows. Yeah, but they have unlimited flows, too. Well, yeah, they may. I don't know if they have them, but I think Celiggo is everybody has now got Yeah. So, I'm But the bottom line is that this was never a thing until like two months ago when he questioned Yeah. But with what you're saying, this goes into this gray area a little bit as well. Uh I'm just playing devil's advocate. As a customer, I could say, I told you to integrate my Amazon.

### **05:05:29** {#05:05:29}

**Michael Flynn:** I didn't say only Amazon USA, you know, as part of your consulting. You got to take a look, right? And and ask the right questions. So, you know, because if you if we had logged into Amazon and examined what their story is about between the development and us as consulting engineers, could the customer argue that, hey, what were you looking at? Yeah, I mean that's right. I think it's always important. important to remember that customers are dumb. Customers don't know what they don't know. So then when they say something generic like I want my Shopify integrated. Yeah. They assume you know every little detail that they're thinking for some reason even though they don't even if they don't put it out there. Yeah. Um and part of it's on us to dig further and to dig in. Now I think some of the stuff about the navigation and some of the other stuff that you guys UAT like even if we messed it up UAT should have caught this that should have been a use case right like so there are gates here that were their responsibility that didn't that should have triggered that they didn't pass but let's anticipate the response because they're going to say we're not the tech guys we don't know we just asked for Amazon that's right or did we miss like one of the stores Yes.

### **05:06:52** {#05:06:52}

**Michael Flynn:** Yeah. Mexico and Canada. Technically, three of the zero sales on the third one. Yeah. But Mexico and Canada, they have other countries. Brazil. I didn't even know they existed. And we configured US and they they were like, "Yep. Okay." Again, like they partially my fault still, but yeah, I think this one this falls into like there's partial responsibility on both sides. part Mike said if they would have done better UAT. Yeah. Would have came up. Yeah. Their UAT sucked. They basically said said, "Well, you said it worked. We're good." Which isn't the first time I've heard you guys talk about them falling down on No, I I explicitly told them I said you and I told Justin and and but this is the same customer. But yeah. Yeah. That hey, you guys should not even move forward until they complete detailed UAT and sign off and all that kind of stuff. I mean for all customers with Shopify stuff I'm not Yeah.

### **05:07:50** {#05:07:50}

**Michael Flynn:** Yeah. And but to be fair, their new developer did share his list which is has like 25 use cases already. That's good. Which I think should might even be expanded but you know and it will. Yeah. Are we stopping this? I think we should stop the recording. Okay. I've ended the meeting so everybody needs to end the meeting. We're recording this up. I did. So, can we You guys are working from here. Head back. I'm going to step away. I've got a errand to run, but I'll have to head back. Yeah, but I mean I'm at your whim. So, yeah. The room has like decent set of It does a nice big room for us. I think we're wrapping for today. Okay. Yes. Yeah. Yeah. You guys can certainly continue whatever work you want to do. This room is available to us till 5\. Yeah.

### **05:08:46**

**Michael Flynn:** So, you're welcome to work here. Welcome to go back if you want to go back, but you know, the room is available till 5\. Justin, do you have any calls this afternoon? I do not. So, let me know when it's convenient to you. I know you're probably still working on followup for problems to to uh sync up. Do you mind just hanging out for a few minutes? We can just catch up on a couple of things. As long as you can drive me back if these guys are going to leave. Oh, I'll drive you back. Uh I mean I I can hang around here. Yeah, one of you can drive me back if you if you're taking off. Yeah, I got my car, too. So, the three cars. Yeah, perfect. I'll head back. Okay. and see you tomorrow or any steak. How is that session? Well, I'll be happy to go to dinner if you guys want to go to dinner and I can do whatever.

### **05:09:33**

**Michael Flynn:** Like Justin and I really wanted to check out that little baseball thing. How long is that open? We probably have to book a thing. Yeah. Yeah. Um I think you could book till 9, maybe 8:30. You guys want to go before dinner and then go to dinner because there's places that are open quite late. Yeah, I could do either. We could I could just grab appetizers while we're there. Like all any of that stuff is fine. Um let me let me find the link and I got it. First of all, does anybody else want to join? Nope. With that, you can take some time to think about it. I've already been to it and it's too many kids involved there. Is it outside? No, it's an indoor thing. It's kind of like the Top Golf of baseball, but yeah, it's a simulator style. coming wearing sandals, which probably isn't the best. I honestly don't think it really matters.

### **05:10:22**

**Michael Flynn:** They just pop a little baseball up in front of you like as if you're like stick stick ball, right? Kind of. Yeah, that's what it looks like. I guess I'll go with you guys. It's just a matter of And then you hit it into a screen like a golf simulator and it tells you whether you hit a home run. Oh, gotcha. Gotcha. Play it any ball. That sounds fun. I mean to meet someone. What time do you What time? I don't know. We need 60 90 or 120\. Oh, minutes. Yeah. Uh 90 sounds good. Well, let's depending what times are available. Do you need to register how many people or that can No, I think we get a bit booth and however many. Oh, I mean there's there's like plenty of openings. Oh, it's 80 bucks an hour after. No, I think that's for the full Oh, no. You're right. Just goes up.

### **05:11:10**

**Michael Flynn:** So, what do you guys want? Would you want you guys want to eat first or do you want to eat? Well, what time you Let's go 60\. Are you supposed to meet them before meeting for dinner? Yeah. Oh, you're meeting you're meeting somebody for dinner anyways. Okay. Xbox. Do you guys just want to Who's your Xbox? You going to work in Houston? Did you talk to you? Baker Hughes. I mean, he was my Baker Hughes. Okay. He was my classmate and my manager both. They'll say they'll say come to the door again. They'll be like close. Do you want to do like an hour at like 7? Do they have food there? Yeah, it looks like they I don't care. Whatever you guys want there. Okay. Some of it outside a pretty cool place full service restaurant. So it is nice. I let get some work done maybe with lifetime and then go out for dinner.

### **05:12:15**

**Michael Flynn:** See you guys. I thought you were going dinner with your boss. I am. Dumbling up dinner at 9 also. Don't worry. This is a DC. It's a second gonna look like me by the end of the trip. And this is Houston. You don't want to miss this opportunity. All the complaints I have with Houston. Food is food's not one of them. If I ever move away from Houston, that will be the one thing I'll miss. Especially where I live on the Asus Galleria. Like, and I don't appreciate it in Charleston either. It's there's a good food scene in Charleston, I'm sure you know. Yeah. Yeah. But I don't we don't ever go out. I mean I know why but but yeah I mean Houston the number of different uh types of restaurant is now exceeding even New York. Yeah. And and really high quality options and across a wide variety of price ranges.

### **05:13:13**

**Michael Flynn:** Yeah. I mean there's Yeah. You don't it doesn't have to be five thing. There's a lot of Tell me what time what time for what? Are we heading there? Yeah. So, we could either eat there, we could get something to eat beforehand or afterward. Like, we have plenty of time off. You guys already had seven. I would just plan on eating there. Okay. Because logistically, it's just going to be like You don't You don't care about being left out here? No, of course not. Maybe a little later then. Yeah. 7:30. Yeah, just do what what you feel is appropriate. I see would know this guy when Hanser get killed in a motorcycle accident. So this Irish singer um his most famous work. He's in a band called The Frames. The frames falling slowly is like a solo song from this movie that people probably know. Okay, I'm not going to do this, but you can pre-order a bucket of beers.

### **05:14:31** {#05:14:31}

**Michael Flynn:** I can't drink right now on this prescription though. Unfortunately, most likely. All right. So, tomorrow's all about figuring out our execution plan. I've got this thing chewing through 44 trying to come up with a baseline for us to start with. I'm sure it's going to go the same way. We're going to have to iterate a little bit. We're going to have to try some things, but see what we can do. Excellent. Yeah. Two days. Yeah. It feels like kind of I mean this is obviously we we investigate but it feels like some of the biggest opportunities for building in some out of the box automation ready to go for clients is going to be um maybe the lower hanging claude on the implementation side. Well, and I think that gets to like Kaha's weekly executive summary skill that we need to get booted in here as well. Um, because yes, it seems like when we get into an execution phase, part of this is going to be similar to what we're already doing.

### **05:15:41** {#05:15:41}

**Michael Flynn:** Like, okay, this is the task I want to work on. Help me game plan this. And we'll come up with something that's going to ask you questions. Say, hey, go back to the client for this. here's the recording of this client meeting. Yeah. Um some things like that. But in in some ways that's not going to be that's kind of what I'm doing anyways in some cases, but just not on a consistent bang up every day. Yeah. Think now if we can keep it organized. I just asked this how it how it thinks it should be used for this phase. And it's like, well, I should first write the write the task over to Osana. I'm like, you're right. You probably should. I didn't think about that, but So, all right, let's dig into that tomorrow. Um, same time. Yep. Break. Cool. All right. Temperaments. You want to talk about temperaments?

### **05:16:35** {#05:16:35}

**Michael Flynn:** Sure. I'll see you tomorrow. Not for the post dinner at 7 and breakfast. Uh, was that room still open when you walked over there or I Or you didn't end up. Okay. I know. Cuz you had some stuff you wanted to catch up on too. Yeah, just we can even just step out to hear that getting fired. I thought that's why you flew me down. Do I need to Can you at least talk to my dinner? Is it too late to order another round of Just give me one sec. Yeah, no worries. All right, guys. Thank you. All right, ma'am. See you tomorrow. See you. There is somebody that I just checked. Yeah, we don't need It's under transactions somewhere. There's label printing. Where's this? Oh, sorry. Um, all right. I just I just wanted to kick off a question to Yeah. Notebook.

### **05:18:51** {#05:18:51}

**Michael Flynn:** They they hurry. Um, there it is. AI laptops and workstations. That's interesting. Jesus where my keys Maybe some of this trash. Yes. So I think you've already did it. Well, I don't know. I think based on what I understood last, I think it's going to be done. So we talked about that. One thing I do want to talk about is this rock 44 profile. yet. I don't know how we're gonna deal with this because you know this the problem is Justin's not confident about the fact that he did establish a separate project. I don't think it was going to project. We're going to have to give conception. Okay. I just believe we will. We just don't have a good answer. Yeah, that's okay. Um what like what kind of like 20 to 30 hours I'm guessing um do it in another way do it as future credit I think that okay yeah it might actually be better for us anyways than trying to get months of free NS views. Yeah. So, um I guess I would like I think there's responsibility on both sides. It sounds like from hearing this. Yeah. I would my preference would be to try to play that card and see if we can get a partial credit. But listen, we we want them to sign up more. We want them to renew and stay renewed. So I think making it right, making a concession is okay here. Yeah. Be a lot easier if maybe we're just on an unlimited MSP. But I think I think long term for long-term preservation of the customer, we may be better off seating. Yes. Planning, you know, I think I think you're right. said, "I

### **Transcription ended after 05:32:26**

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*
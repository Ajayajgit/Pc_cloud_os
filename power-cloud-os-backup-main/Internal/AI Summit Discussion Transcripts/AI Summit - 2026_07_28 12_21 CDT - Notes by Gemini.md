# **✍️ Quick notes**

## **AI Summit**

Jul 28, 2026  
[Michael Flynn](mailto:mike@powerclouderp.com) [Ron Shaw](mailto:ron@powerclouderp.com) [Justin Lombardi](mailto:justin@powerclouderp.com) [Imran Shabbir](mailto:imran@powerclouderp.com) [Taha Raja](mailto:taha@powerclouderp.com)

The meeting focused on integrating AI into consulting workflows via strategic automation and evidence-based assessment methodologies.

## **AI-Driven Consulting Strategy**

* Consultant value redefined: prioritizing strategic business guidance over manual tasks like data entry and coding.  
* Human expertise remains essential for high-level questioning and business strategy.  
* Proposed cultural shift: adopting an AI-first mindset for all project phases.  
* Risk of "garbage in, garbage out" emphasized, necessitating precise prompt engineering.  
* Transition from manual tasks to AI execution deemed essential for long-term competitiveness.

## **Tooling and Technical Infrastructure**

* Ongoing development utilizes Claude for meeting summaries, rapid assessments, and email drafting.  
* Capability established to rebuild infrastructure, such as websites, without external platform dependencies.  
* Conceptualized evolution toward an agentic PowerCloud portal to orchestrate specialized AI agents.  
* Acknowledged technical limitation where specific NetSuite accounting preferences cannot be set via SDF.

## **Shifting Market Landscape**

* Observed rapid shift toward development methods bypassing traditional platform dependencies.  
* Noted emergence of competitors offering rapid deployments via AI-integrated stacks.  
* Observed shortening of long-term planning cycles, favoring rapid adaptation and new opportunity exploration.

## **Claude Code Infrastructure and File Management**

* Claude Code workflow centers on a root 'Assessments' folder containing individual customer subfolders (Michael Flynn).  
* Standardized directory structure includes 'Source' for client materials, 'Working' for scratchpads, and 'Deliverables' for outputs.  
* The 'Claude.md' file functions as the centralized, organization-wide instruction set for consistent operations.  
* Google Drive sync is the established method for maintaining shared project folder access.

## **Assessment Methodology and AI Integration**

* Assessment process involves mining transcripts and cross-referencing client claims against actual NetSuite verification data (Michael Flynn).  
* AI tools generate discovery agendas, evidence logs, and specific interview questions, reducing manual preparation time (Taha Raja).  
* Proposed intake 'wizard' to classify engagements as new implementations versus existing customers to tailor AI logic (Michael Flynn).  
* PowerPoint decks established as the preferred client presentation format, supplemented by detailed markdown assessment documents.

## **Technical Capabilities and Roadmap**

* Model Context Protocol (MCP) integration now supports direct JavaScript reading, resolving previous script analysis limitations.  
* Development of executable SDF projects from execution plans targeted as a future capability.  
* Current Claude subscription usage limits necessitate an evaluation of purchasing overages or upgrading seat tiers (Michael Flynn).

## **AI-Enhanced Consulting Standards**

* Prioritize conversational engagement over reading verbatim from AI-generated slides (Taha, Michael).  
* Emphasize mandatory proofreading of AI outputs to prevent presenting inaccurate information.  
* Adopt strategy: stabilize the foundation, address 'bleeder' issues, and reduce the custom footprint.  
* Approved dual-document strategy: use slideshows for client calls and deliver detailed documents post-meeting.

## **Assessment Document Methodology**

* Evaluated two assessment approaches: AI-driven (strong on epistemic discipline) vs. Work-item focused (strong on closure, dependencies, and owners) (Michael).  
* Defined epistemic discipline as explicitly labeling verified versus unverified content to build client trust.  
* Proposed merging assessment styles to combine epistemic honesty with actionable project management.  
* Delivered roadmap allows clients to fund projects in prioritized, manageable pieces.  
* Identified that AI-generated assessments require complete data access (e.g., warehouse information) to avoid missing critical context.

## **Technical Customization & Execution**

* Demonstrated use of sweetlets and direct database queries to bypass Netsuite reporting limitations.  
* Successfully normalized historical sales data using AI-assisted database coding (Michael).  
* Validated that non-technical staff can leverage AI tools (e.g., Claude) to generate complex solutions previously requiring dedicated developer involvement.  
* Established use of project-specific chat structures to maintain context without repeating commands.

## **Shinasty Client Assessment Findings**

* Shinasty maintains a complex, custom-built NetSuite environment including proprietary WMS and shipping software.  
* Operational inefficiencies include 8 to 10-day month-end close cycles and recurring manual fixes for Amazon settlements.  
* Performance bottlenecks attributed to 1.84 million customer records; inactivating older records suggested as a remediation.  
* Claim regarding client's intention to migrate off NetSuite identified as unverified and inconsistent with assessment findings.

## **AI Methodology and Operational Standards**

* Recommended shifting from 'rapid assessment' to 'fast discovery' terminology for future engagements.  
* Current AI-generated reports critiqued for verbosity and excessive inclusion of uncontextualized customer quotes.  
* Adopted strategy to prioritize detailed, context-rich prompts over generic instructions to improve output accuracy.  
* Human oversight confirmed as essential to mitigate AI limitations and ensure report reliability.

## **Technical Architecture and Workflow Debates**

* Integration gaps identified in Shopify flows regarding missing customer deposit handling, causing revenue/cash discrepancies.  
* High-frequency inventory syncing identified as a potential catalyst for overselling due to fulfillment latency.  
* System complexity exacerbated by redundant payment processing integrations including Nimbus, VersaPay, and CyberSource.

## **Rapid Assessment Document Strategy**

* Prioritized concise, template-driven formatting over verbose, unstructured narratives to improve client focus (Michael Flynn).  
* Identified critical content gaps in AI output, specifically payout automation and inventory packaging workflows (Michael Flynn, Taha Raja).  
* Proposed creating a supplemental fast follow section for low-priority items instead of embedding them in main assessment documents (Michael Flynn, Taha Raja).

## **AI Tooling and Process Integration**

* Initiated iterative process of comparing prompts and templates to enhance AI assessment quality overnight (Michael Flynn).  
* Differentiated technical capabilities: Model Context Protocol (MCP) handles data and record interactions, while SuiteCloud Development Framework (SDF) manages environment configuration deployment (Michael Flynn).

## **Meeting and Development Logistics**

* Confirmed daily start time of 8:00 AM to maximize development time while maintaining billable work availability (Michael Flynn).  
* Adopted strategy to switch focus to secondary topics during AI processing periods to optimize efficiency.

## **Next steps**

- [ ] \[The group\] Brainstorm AI Requirements: Identify specific needs and workflows for day to day consulting life. Define how artificial intelligence can be integrated into the consulting process.  
- [ ] \[The group\] Identify Automatable Processes: Determine which manual technical tasks or project phases should be offloaded to artificial intelligence. List processes that currently consume excessive time for potential automation.  
- [ ] \[The group\] Propose Interface Design: Conceptualize the user interface for the planned professional tools. Suggest how consultants should interact with the AI driven system.  
- [ ] \[Michael Flynn\] Clarify Canva Usage: Coordinate with Steve to determine if Emily should continue using the Canva tool. Verify the necessity of the subscription given current capabilities.  
- [ ] \[The group\] Test Folder Structures: Tweak and test the Claude Code folder structure throughout the week.  
- [ ] \[Taha Raja\] Run Recordings: Process Shiny recordings through Claude Code to compare the output against previous manual work.  
- [ ] \[The group\] Address Usage Limits: Evaluate and decide between purchasing overage or upgrading seats to resolve Claude subscription usage limits.  
- [ ] \[The group\] Update Blueprint: Add the NetSuite blueprint document as a source and integrate it with basic discovery questions.  
- [ ] \[The group\] Define Assessment Type: Update the agentic process to explicitly define whether an engagement involves an existing customer or a brand new implementation during the initial interaction.  
- [ ] \[The group\] Configure File System: Configure Google Drive within the local file system and ensure all future code runs within the assessments folder with specific project subfolders.  
- [ ] \[The group\] Record Client Calls: Record every client call moving forward to ensure comprehensive data collection for future assessments.  
- [ ] \[Michael Flynn\] Migrate Project Folders: Move all existing Claude project folders into the central assessments directory structure.  
- [ ] \[Justin\] Review Meeting Notes: Review the calendar event for the price tag printing meeting to verify the availability of the artificial intelligence summary and transcript.  
- [ ] \[Ron\] Compare Assessment Documents: Evaluate the assessment and work item documents to determine their quality and utilize artificial intelligence to conduct a comparative analysis of both versions.  
- [ ] \[Michael Flynn\] Connect Model Context Protocol Accounts: Input the customer account numbers into the global Model Context Protocol settings to establish the required custom connections.  
- [ ] \[The group\] Confirm Priorities: Agree on the three project priorities to allow for the development of a costed and sequenced roadmap.  
- [ ] \[Michael Flynn\] Compare Documents: Submit both the rapid assessment document and the PowerPoint to the artificial intelligence model for comparative analysis.  
- [ ] \[Michael Flynn\] Investigate Assessment: Audit the artificial intelligence generated assessment document to identify why it missed the customer deposit and payout reconciliation topics.  
- [ ] \[Michael Flynn\] Verify NetSuite Source: Review previous meeting notes or contact Steve to determine the origin of the claim regarding leaving the NetSuite platform.  
- [ ] \[The group\] Improve AI Prompt: Refine prompt instructions to ensure consistency and prevent inclusion of irrelevant quotations in future assessment reports.  
- [ ] \[Imran\] Email Rod: Draft a formal email regarding the sandbox rework. Copy Michael Flynn on the correspondence to review the proposed response.  
- [ ] \[Claude\] Compare documents: Analyze the provided documents to identify discrepancies between the task lists. Evaluate content quality and point out specific missing items.  
- [ ] \[Michael Flynn\] Update files: Edit the markdown files to incorporate feedback and improvements from the team discussion. Prepare the system to rerun the assessment process tomorrow.  
- [ ] \[The group\] Verify wholesale flow: Confirm which wholesale flow utilizes the live market time integration. Document this specific workflow to ensure accurate assessment.  
- [ ] \[The group\] Provide version: Provide the NetSuite release version for the system. Ensure this information is documented for the assessment record.  
- [ ] \[The group\] Document transactions: Capture full examples of transactions that post after a period is locked. Maintain a record of these instances for the project documentation.  
- [ ] \[The group\] Validate discounts: Research if Shopify and New Order allow order level and line level discounts simultaneously. Clarify if NetSuite can process these configurations correctly.  
- [ ] \[The group\] Surface prompt: Locate the prompt and template used for the assessment. Add this information to the top of the AI summit document for reference.  
- [ ] \[Michael Flynn\] Complete Homework: Finish the tasks assigned for tonight.  
- [ ] \[Michael Flynn\] Start Iteration: Launch a second iteration of the process overnight to prepare for tomorrow morning.  
- [ ] \[The group\] Manage Time: Transition to other topics whenever the system is processing to avoid waiting on screen.  
- [ ] \[Taha Raja\] Suggest Dinner: Post a list of restaurant recommendations in the group chat for dinner tonight.

**Want to see more?** [View the full notes]()  
Tip: You can always access your full notes from the left sidebar.

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*  
*How is the quality of **these specific notes?** [Take a short survey](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?confid=ochUdjy75eN7rFN5gv8cDxIROAIIigIgABgBCA&entryPoint=footerQuickNotes&isGoogler=False) to let us know your feedback, including how helpful the notes were for your needs.*

# **📝 Full notes**

Jul 28, 2026

## **AI Summit**

Invited [Michael Flynn](mailto:mike@powerclouderp.com) [Ron Shaw](mailto:ron@powerclouderp.com) [Justin Lombardi](mailto:justin@powerclouderp.com) [Imran Shabbir](mailto:imran@powerclouderp.com) [Taha Raja](mailto:taha@powerclouderp.com)

Attachments [AI Summit](https://calendar.google.com/calendar/event?eid=NDRpN2VuNm5nY2k0N2NqaGFuZGJpcGhkZnJfMjAyNjA3MjhUMTIwMDAwWiB0YWhhQHBvd2VyY2xvdWRlcnAuY29t)

Meeting records [Transcript](https://docs.google.com/document/d/1t_iZ8dHQl2OQElCrkvGJCdZozXVp8wI6oe0LSonTx6I/edit?usp=drive_web&tab=t.cnpzx5l7e0j8) [Recording](https://drive.google.com/file/d/1psR9ctDNiNzKpkHf27daMFqYlmAxgsYb/view?usp=drive_web) 

### **Summary**

The meeting focused on integrating AI into consulting workflows via strategic automation and evidence-based assessment methodologies.

**Strategizing AI-Driven Consulting Workflows**  
The team aims to pivot from manual technical execution to AI-assisted advisory roles. This transition utilizes automated documentation and deployment frameworks to prioritize high-value business guidance over repetitive technical tasks.

**Stabilizing Technical Systems First**  
Successful AI implementation requires stabilizing foundational infrastructure like data reconciliation and script management before enabling advanced automation. This approach ensures AI outputs are built upon clean data and accurate system states.

**Refining Client Assessment Deliverables**  
A decision was made to shift from long, verbose AI-generated documents to a concise hybrid format blending detailed analysis with actionable summary tables. This refinement improves communication clarity and aligns deliverables with client needs.

### **Decisions**

## Aligned

* **Elimination of manual grunt work** The team adopts the foundational premise that manual "grunt work" is obsolete and will be handled by automation tools.

* **Adoption of AI-first cultural approach** The company commits to adopting an "AI-first" methodology as an integral part of its organizational culture and workflow.

* **Strategic shift to platform-agnostic operations** The team establishes a strategic shift to pursue a platform-agnostic consulting model, moving beyond being solely reliant on NetSuite.

* **Centralized master instructional file usage** The claude.md instructional file will be maintained as a centralized master file within the assessments folder, rather than being copied or duplicated for each individual client project.

* **Standardized project folder structure** All client projects must be structured as subfolders located within the centralized assessments Google Drive folder to ensure consistent, collaborative access.

* **Mandatory client call recording policy** The team will record every client call, including pre-sales, kickoff, and discovery sessions, to support comprehensive data aggregation for AI processing.

* **Client document delivery strategy** The team aligned to utilize the slideshow during client calls and deliver the detailed document to the client afterward, rather than using only one of these formats.

* **Level of effort drafting strategy** The team decided to draft all documents with Level of Effort numbers flagged as 'draft' rather than calibrating the menu before rendering.

* **Client deliverable scope strategy** The team decided to include the full menu of identified work in client deliverables to provide complete scope visibility, allowing the client to choose what to fund.

* **MCP sandbox connection strategy** The team decided to utilize the sandbox environment when establishing MCP connections for initial project setups.

* **Fast discovery terminology adopted** The service name is changed from 'rapid assessment' to 'fast discovery' to more accurately represent the nature of the engagement.

* **LOE expectation communication strategy** The team will explicitly communicate to clients that rapid assessments conducted without full on-site discovery will not result in 100% firm Level of Effort (LOE) estimates, as some topics will require additional discovery.

* **Supplemental findings documentation standard** Low-priority or supplemental assessment findings will be captured in a dedicated, concise section of the project document rather than being excluded, to be addressed after primary objectives are met.

* **Account customization implementation strategy** Account customization and system configuration changes will be executed using the Sweet Cloud Development Framework (SDF) to ensure implementation capability regardless of MCP availability.

We've **updated the Decisions section** using your feedback.

Let us know what you think: [Helpful](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?isHelpful=True&entryPoint=decisions&confid=ochUdjy75eN7rFN5gv8cDxIROAIIigIgABgBCA&isGoogler=False) or [Not Helpful](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?isHelpful=False&entryPoint=decisions&confid=ochUdjy75eN7rFN5gv8cDxIROAIIigIgABgBCA&isGoogler=False)

### **Next steps**

- [ ] \[The group\] Brainstorm AI Requirements: Identify specific needs and workflows for day to day consulting life. Define how artificial intelligence can be integrated into the consulting process.

- [ ] \[The group\] Identify Automatable Processes: Determine which manual technical tasks or project phases should be offloaded to artificial intelligence. List processes that currently consume excessive time for potential automation.

- [ ] \[The group\] Propose Interface Design: Conceptualize the user interface for the planned professional tools. Suggest how consultants should interact with the AI driven system.

- [ ] \[Michael Flynn\] Clarify Canva Usage: Coordinate with Steve to determine if Emily should continue using the Canva tool. Verify the necessity of the subscription given current capabilities.

- [ ] \[The group\] Test Folder Structures: Tweak and test the Claude Code folder structure throughout the week.

- [ ] \[Taha Raja\] Run Recordings: Process Shiny recordings through Claude Code to compare the output against previous manual work.

- [ ] \[The group\] Address Usage Limits: Evaluate and decide between purchasing overage or upgrading seats to resolve Claude subscription usage limits.

- [ ] \[The group\] Update Blueprint: Add the NetSuite blueprint document as a source and integrate it with basic discovery questions.

- [ ] \[The group\] Define Assessment Type: Update the agentic process to explicitly define whether an engagement involves an existing customer or a brand new implementation during the initial interaction.

- [ ] \[The group\] Configure File System: Configure Google Drive within the local file system and ensure all future code runs within the assessments folder with specific project subfolders.

- [ ] \[The group\] Record Client Calls: Record every client call moving forward to ensure comprehensive data collection for future assessments.

- [ ] \[Michael Flynn\] Migrate Project Folders: Move all existing Claude project folders into the central assessments directory structure.

- [ ] \[Justin\] Review Meeting Notes: Review the calendar event for the price tag printing meeting to verify the availability of the artificial intelligence summary and transcript.

- [ ] \[Ron\] Compare Assessment Documents: Evaluate the assessment and work item documents to determine their quality and utilize artificial intelligence to conduct a comparative analysis of both versions.

- [ ] \[Michael Flynn\] Connect Model Context Protocol Accounts: Input the customer account numbers into the global Model Context Protocol settings to establish the required custom connections.

- [ ] \[The group\] Confirm Priorities: Agree on the three project priorities to allow for the development of a costed and sequenced roadmap.

- [ ] \[Michael Flynn\] Compare Documents: Submit both the rapid assessment document and the PowerPoint to the artificial intelligence model for comparative analysis.

- [ ] \[Michael Flynn\] Investigate Assessment: Audit the artificial intelligence generated assessment document to identify why it missed the customer deposit and payout reconciliation topics.

- [ ] \[Michael Flynn\] Verify NetSuite Source: Review previous meeting notes or contact Steve to determine the origin of the claim regarding leaving the NetSuite platform.

- [ ] \[The group\] Improve AI Prompt: Refine prompt instructions to ensure consistency and prevent inclusion of irrelevant quotations in future assessment reports.

- [ ] \[Imran\] Email Rod: Draft a formal email regarding the sandbox rework. Copy Michael Flynn on the correspondence to review the proposed response.

- [ ] \[Claude\] Compare documents: Analyze the provided documents to identify discrepancies between the task lists. Evaluate content quality and point out specific missing items.

- [ ] \[Michael Flynn\] Update files: Edit the markdown files to incorporate feedback and improvements from the team discussion. Prepare the system to rerun the assessment process tomorrow.

- [ ] \[The group\] Verify wholesale flow: Confirm which wholesale flow utilizes the live market time integration. Document this specific workflow to ensure accurate assessment.

- [ ] \[The group\] Provide version: Provide the NetSuite release version for the system. Ensure this information is documented for the assessment record.

- [ ] \[The group\] Document transactions: Capture full examples of transactions that post after a period is locked. Maintain a record of these instances for the project documentation.

- [ ] \[The group\] Validate discounts: Research if Shopify and New Order allow order level and line level discounts simultaneously. Clarify if NetSuite can process these configurations correctly.

- [ ] \[The group\] Surface prompt: Locate the prompt and template used for the assessment. Add this information to the top of the AI summit document for reference.

- [ ] \[Michael Flynn\] Complete Homework: Finish the tasks assigned for tonight.

- [ ] \[Michael Flynn\] Start Iteration: Launch a second iteration of the process overnight to prepare for tomorrow morning.

- [ ] \[The group\] Manage Time: Transition to other topics whenever the system is processing to avoid waiting on screen.

- [ ] \[Taha Raja\] Suggest Dinner: Post a list of restaurant recommendations in the group chat for dinner tonight.

### **Details**

*Did the screenshots in this section make your notes [better](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?entryPoint=multimodal&isGoogler=False&isBetter=True&confid=ochUdjy75eN7rFN5gv8cDxIROAIIigIgABgBCA) or [worse](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?entryPoint=multimodal&isGoogler=False&isBetter=False&confid=ochUdjy75eN7rFN5gv8cDxIROAIIigIgABgBCA)?*

* **Meeting Logistics**: Michael Flynn and Taha Raja discussed the physical layout of the meeting space, including the location of water, coffee stations, and restrooms to ensure all attendees were settled ([00:00:01](#00:00:01)).

* **Big Picture AI Vision**: Michael Flynn initiated the discussion by outlining the goal of leveraging AI on the consulting side of the business, building upon existing development and testing efforts. The objective for the summit is to determine how AI can integrate into daily consulting workflows, such as meeting preparation, post-meeting documentation, and generating deployable Sweet Cloud Development Framework projects ([00:01:38](#00:01:38)).

* **Reducing Manual Workload**: Michael Flynn emphasized the intent to reduce manual tasks for consultants, such as data entry, creating import files, and manual configuration adjustments. They argued that the value of a consultant lies in their ability to ask insightful questions and provide business guidance rather than performing technical grunt work that AI can automate ([00:04:06](#00:04:06)).

* **Interface and Strategy Development**: Michael Flynn requested input on designing a professional AI interface to replace current prototypes, specifically moving beyond existing Cloud Code implementations. The team plans to use this week to gather requirements and identify the most effective way for consultants to interact with AI tools ([00:05:18](#00:05:18)).

* **Industry Transformation and Value**: Michael Flynn and Taha Raja discussed the fundamental changes in the consulting business, noting that tools like the MCP connector are already automating manual processes like save searches. They agreed that their core value remains the intersection of technology and business process expertise, even as the technical barriers to entry decrease ([00:06:38](#00:06:38)).

* **Business and Delivery Models**: The team discussed exploring new service models, such as delivering implementations through managed service packages. Michael Flynn reiterated that the "garbage in garbage out" principle still applies, requiring consultants to provide precise business context and high-quality prompts to obtain useful AI outputs ([00:09:08](#00:09:08)).

* **Evolution of Consulting Roles**: Michael Flynn stated that while low-level scripting tasks are being automated, the role of a consultant as an expert who can guide customers to solutions remains secure. The goal is to create more time for these high-value interactions by offloading technical tasks to AI ([00:11:43](#00:11:43)).

* **AI Capabilities and Technical Constraints**: Michael Flynn and Taha Raja reviewed current pre-visit assessment tools that help surface discovery questions. They identified specific technical limitations, such as the inability to set accounting preferences via the Sweet Cloud Development Framework, though noted that custom records, fields, and core scripts can be deployed ([00:12:54](#00:12:54)).

* **Agentic AI and Interface Design**: The participants discussed moving toward an "agentic" AI approach, where the backend dynamically selects models based on the task, citing advancements in medical AI as a benchmark for professional-grade user interfaces ([00:15:16](#00:15:16)).

* **Personal Tool Demonstration**: Michael Flynn demonstrated a personal organizer tool that aggregates calendar invites, meeting transcripts, and emails to manage tasks and provide summaries. Taha Raja noted the potential for this tool to be mobile-enabled to assist with project management and communication ([00:17:20](#00:17:20)) ([00:31:49](#00:31:49)).

* **Establishing an AI-First Culture**: Taha Raja stressed the importance of fostering an "AI-first" culture within the company, urging the team to integrate AI into every stage of their workflow rather than relying on manual, legacy processes. They suggested using tools like Application Performance Monitoring to interpret data rather than performing manual investigations ([00:21:05](#00:21:05)).

* **Compliance and Privacy Concerns**: The team acknowledged that some clients may have concerns regarding compliance and government grants when implementing AI. Michael Flynn noted that while they must take these concerns seriously, they must continue to navigate them to remain competitive ([00:23:14](#00:23:14)).

* **Economic Realities of AI**: Taha Raja and Michael Flynn discussed the potential for increased AI costs as developers seek to recover massive investment capital. They emphasized the need to focus on how AI can exponentially increase their ability to open new business doors, rather than just viewing it as a mechanism for cost reduction ([00:26:12](#00:26:12)).

* **Encouraging AI Adoption**: To address team anxieties about job loss, Taha Raja emphasized that the goal is to expand the business and increase capacity rather than reduce staff. Michael Flynn added that engaging critically with AI outputs helps prevent skills from becoming dull and keeps expertise sharp ([00:27:32](#00:27:32)).

* **Designing Proactive AI Tools**: The participants brainstormed the creation of a proactive tool that could reside in communication channels to offer project-specific guidance. They aim to generate a feature wish list during the summit while managing token usage and ensuring the tool intervenes appropriately ([00:29:51](#00:29:51)).

* **Tool Functionality and Task Management**: Michael Flynn described the current organizer tool's ability to draft emails and summarize meetings, noting that it currently lacks automated sending capabilities for safety. Taha Raja suggested adding a dismiss button to improve the tool's relevance by allowing users to flag irrelevant tasks ([00:32:56](#00:32:56)).

* **Technical Infrastructure**: Michael Flynn provided details on the tool's current hosting, which utilizes a server based in Virginia and Cloudflare for security, serving as a practical proof-of-concept for future developments ([00:35:51](#00:35:51)).

* **Vision for a PowerCloud Portal**: The team explored the potential for a dedicated, internal portal that employees could use to manage projects. They debated whether to provide direct client access to these AI interfaces or keep the AI as an internal tool that syncs data with NetSuite ([00:36:42](#00:36:42)).

* **Automated Error Monitoring**: Taha Raja highlighted an experiment involving a chatbot that monitors and reports Celigo errors every 15 minutes. They noted that this approach significantly improves efficiency compared to traditional, manual email monitoring ([00:38:23](#00:38:23)).

* **Adapting to Rapid Changes**: Discussing the current technological landscape, the participants noted that the era of long-term planning has shifted toward rapid adaptation. They emphasized the necessity of embracing AI to uncover new, currently unforeseen opportunities ([00:40:23](#00:40:23)) ([00:42:32](#00:42:32)).

* **The Value of Human Presence**: Michael Flynn and Taha Raja agreed that on-site interactions remain essential for building chemistry and gathering nuanced context that AI cannot currently replicate. They concluded that the human element is vital for defining the project scope before AI is used for technical execution ([00:43:44](#00:43:44)).

* **Market Competitors and Alternatives**: The team analyzed NetSuite alternatives and market competitors that promise rapid implementations. While noting these platforms offer strong accounting backends, they often lack the comprehensive functionality of NetSuite, making the market dynamic and evolving ([00:46:26](#00:46:26)).

* **Expanding Scope Beyond NetSuite**: The group discussed applying their expertise to platforms outside of NetSuite, with Michael Flynn suggesting that their combined knowledge of business processes and data makes this transition viable. They noted that hyper-customized workflows offer competitive advantages in speed and cost ([00:50:35](#00:50:35)).

* **Website Reconstruction Case Study**: Michael Flynn shared an example of using AI to rebuild their company website from scratch, bypassing the need for a platform like WordPress. This resulted in a faster, more performant site that they can now update by simply feeding files to the AI ([00:53:59](#00:53:59)).

* **Trends in Software Maintenance**: The participants observed a broader trend of businesses moving away from monthly platform subscriptions toward bespoke, AI-maintained code. However, they concluded that critical systems like accounting still require the stability of established platforms ([00:57:26](#00:57:26)).

* **Summit Objectives**: Michael Flynn summarized the goals for the remainder of the week: defining a clear vision for AI in their consulting practice, building a feature wish list, and continuing to refine prototypes to improve immediate workflow efficiency ([00:58:42](#00:58:42)).

* **Claude Code Initialization and Folder Structure**: Michael Flynn explained that Claude Code functions by reading a Markdown file (referred to as \`claude.md\`) within a designated folder, which acts as the instruction set for the session ([00:59:56](#00:59:56)). The team established a standardized Google Drive folder hierarchy, which includes specific subfolders for "context," "source" (client-provided materials like recordings and documentation), "working" (for scratchpad notes), and "deliverables" (for final outputs) to maintain organizational consistency ([01:01:11](#01:01:11)) ([01:15:02](#01:15:02)). Participants discussed the requirement that everyone set up Google Drive within their local file systems to facilitate this workflow ([00:59:56](#00:59:56)) ([01:39:05](#01:39:05)).

* **SuiteCloud Development Framework Deployment**: Michael Flynn detailed the current process for deploying SuiteCloud Development Framework projects, noting that while they are currently managed via the command line, the long-term goal is to make these deployments easier for consultants to push to NetSuite accounts. The team acknowledged that pushing these projects is a significant step, and they aim to reach a stage where they can confidently deploy to production after customer sign-off ([01:03:52](#01:03:52)).

* **On-site Discovery Preparation**: The process for preparing for on-site client discovery includes creating an "on-site prep" Markdown file that outlines questions, rationales, and cross-references. This process leverages the Model Context Protocol to verify NetSuite information, such as confirming the number of active scripts versus reported figures, which helps consultants identify discrepancies, like the situation encountered by Imran in China ([01:04:47](#01:04:47)).

* **Project Deliverables and Execution Planning**: The team discussed the three main deliverables for an engagement: a client assessment, a proposal deck, and an execution plan ([01:07:16](#01:07:16)). While the execution plan is currently the least mature component, the consensus is to organize these plans by tasks or use cases, potentially grouping them into separate SuiteCloud Development Framework projects to streamline the implementation phase ([01:08:40](#01:08:40)).

* **Subscription Usage and Limits**: Taha Raja and Michael Flynn discussed challenges regarding Claude subscription usage limits, with participants reporting instances of hitting daily, weekly, or monthly caps. They agreed that they need to determine whether it is more cost-effective to pay for overages or to move team members to higher subscription tiers to ensure uninterrupted workflow ([01:10:47](#01:10:47)).

* **Branding and Level of Effort Documentation**: The team discussed the importance of using Power Cloud brand guidelines for all client-facing documents, including using specific PNG logos and established templates ([01:11:37](#01:11:37)). Additionally, they noted that they will begin recording "level of effort" estimates in a dedicated Markdown file to build a knowledge base of repeatable standards, such as the Shopify baseline, which they currently estimate at 65 hours ([01:13:55](#01:13:55)).

* **Shinasty Project Context**: The group reviewed the Shinasty engagement, described as an Instagram-heavy apparel company, to demonstrate the current Claude Code workflow ([01:16:56](#01:16:56)). The team confirmed they have obtained recordings from the client and intend to use them to refine the rapid assessment process, noting the potential for Claude Code to handle these materials effectively ([01:17:54](#01:17:54)) ([01:21:46](#01:21:46)).

* **Claude Code Interfaces and Usability**: Michael Flynn and Taha Raja compared using Claude Code via the command line interface versus the Claude desktop application interface. While Michael Flynn expressed a preference for the command line due to familiarity, they agreed that the desktop interface provides a functional alternative that allows for browsing folders and using natural language, effectively serving the same purpose without technical limitations ([01:19:57](#01:19:57)).

* **Data Discrepancy Analysis in Shinasty**: The team reviewed the evidence file generated for Shinasty, identifying a significant gap regarding return authorizations ([01:22:56](#01:22:56)). Specifically, the client reported high return rates, but NetSuite data showed a low transaction volume for returns, leading to a discussion about whether the client was performing manual refunds or using alternative processes outside of NetSuite ([01:24:12](#01:24:12)) ([01:46:57](#01:46:57)).

* **Refining Discovery Methodology**: The discussion emphasized the need to integrate supplementary documents, such as NetSuite blueprint documents, into the source folders to generate more robust and relevant discovery questions ([01:25:16](#01:25:16)). Participants agreed that combining these resources with AI-driven analysis allows consultants to move beyond generic "walk me through your process" questions and ask targeted, evidence-based inquiries ([01:26:10](#01:26:10)) ([01:45:17](#01:45:17)).

* **AI-Assisted Strategic Preparation**: Participants discussed using AI to facilitate their internal dialogue and strategy formation, allowing them to ask questions and receive summaries of complex client situations, such as custom solutions for kits or weekly price update tags ([01:27:12](#01:27:12)). This approach allows for the aggregation of related data from diverse sources, enabling consultants to prepare more effectively for client calls and identify potential strategies before engaging the customer ([01:28:12](#01:28:12)).

* **Client Communication Strategies**: Michael Flynn and Taha Raja highlighted the importance of presenting findings to clients in a way that builds confidence and respect ([01:30:20](#01:30:20)) ([01:45:17](#01:45:17)). They agreed that by leading with specific evidence-based findings—such as identifying discrepancies in return data—consultants can demonstrate expertise early, effectively shortening the timeline of questioning and avoiding the need to ask clients to repeat information they have already provided ([01:30:20](#01:30:20)) ([01:44:32](#01:44:32)).

* **Managing Context Windows and AI Agents**: The team discussed the technical constraints of token limits when reading large Markdown files, acknowledging that keeping instruction files concise and modular is important for efficiency ([01:32:37](#01:32:37)). They concluded that while they are currently using a simpler instruction-set approach, the long-term vision may involve more complex agentic structures or "wizard-like" onboarding forms to guide the process without requiring consultants to manage underlying infrastructure ([01:34:18](#01:34:18)).

* **Collaborative Data Storage and Future Vision**: The group debated the best way to share projects, noting that while Google Drive is currently used, Git might be a more robust solution in the future ([01:36:47](#01:36:47)). Michael Flynn proposed a vision for a "notebook" style interface where all client resources, outputs, and internal chats are aggregated in one proactive, actionable location ([01:37:51](#01:37:51)).

* **Google Drive Integration and File Sensitivity**: Michael Flynn confirmed that the team should proceed with the current Google Drive structure, ensuring it is accessible within the local file system ([01:39:05](#01:39:05)). Regarding file sensitivity, such as Statements of Work containing financial data, they concluded that these documents should generally be included so the AI has a comprehensive view of commitments, though they may consider creating redacted copies if necessary ([01:41:12](#01:41:12)).

* **Standardizing Communication and Pre-site Research**: Michael Flynn and Taha Raja emphasized the necessity of recording all pre-sales and internal kickoff calls to ensure the AI has access to the full history of client discussions ([01:42:54](#01:42:54)). They noted that a highly repeatable process, including thorough pre-site research, helps avoid gaps in knowledge, such as the past issue where consultants were unprepared for questions regarding Material Requirements Planning (MRP) on-site ([01:45:17](#01:45:17)).

* **Shinasty Refund Processing Analysis**: During a follow-up discussion on Shinasty, the team clarified that the client handles refunds manually in Loop and brings the refund portion into NetSuite without inventory impact, resulting in zero-quantity transactions that affect reporting ([01:48:01](#01:48:01)). This insight highlighted the importance of using Claude to investigate specific operational anomalies before the on-site discovery phase ([01:46:57](#01:46:57)) ([01:49:06](#01:49:06)).

* **Data Processing and AB Testing**: The team discussed the benefits of processing transcripts versus raw audio files, noting that text-based transcripts are currently preferred for speed and analysis ([01:50:54](#01:50:54)). They suggested that performing AB testing—comparing outputs derived from transcripts versus audio—could be a valuable future experiment to determine if including audio content improves the quality of the AI's insights ([01:51:48](#01:51:48)).

* **Temperaments Case Study and Presentation Output**: The team reviewed the PowerPoint output generated by Claude for the Temperaments project, critiquing the inclusion of raw data in the slide decks ([01:52:48](#01:52:48)) ([01:55:17](#01:55:17)). They agreed that while the content was accurate, they should refine the approach to use the presentation for setting the tone and high-level strategy, rather than displaying raw findings that are better suited for the supporting documentation ([01:55:17](#01:55:17)) ([01:57:06](#01:57:06)).

* **AI Presentation Strategy**: Taha Raja and Michael Flynn discussed the necessity of using AI-generated slides as conversation starters rather than reading them verbatim to clients. They agreed that reading notes directly can diminish perceived expertise and professional value ([01:58:57](#01:58:57)). Taha Raja noted the risks of not proofreading AI output, specifically the danger of presenting inaccurate information, which they described as "catching yourself with your pants down" ([01:59:46](#01:59:46)). They emphasized that memorizing key points and discussing them naturally is the most effective presentation method ([01:58:57](#01:58:57)).

* **Critique of External Vendor Assessments**: Michael Flynn and Taha Raja reviewed a past failed assessment by another vendor, characterizing the previous work as "garbage" that lacked substance ([01:59:46](#01:59:46)). They noted that the vendor provided a high volume of words that failed to offer actionable insights, leading the team to write their own assessment in a single day to replace the insufficient work provided. They confirmed that the previous vendor's assessment was never utilized because the vendor failed to follow up ([02:00:37](#02:00:37)).

* **Assessment Slide Review and Sandbox Limitations**: Michael Flynn read through a slide assessing the client's financial data, highlighting a 7.4-to-1 invoice ratio and the "real load" caused by installment and per-delivery billing models. They identified that the sandbox environment was limited in value for the assessment because it had not been refreshed, leading to potential inaccuracies in sales figures and proportions. Michael Flynn expressed frustration at having to fight to gain access to the production environment ([02:01:25](#02:01:25)).

* **On-Site Assessment Benefits**: Taha Raja and Michael Flynn discussed the advantages of being on-site for assessments, noting that remote requests for data are often resisted by clients, whereas physical presence facilitates cooperation. They mentioned that they could observe data history, such as Commissions distribution issues involving MHI and NetSuite versions running out of order, which causes slow saves ([02:02:31](#02:02:31)).

* **Transcription Issues**: Michael Flynn noted a technical issue with the recording setup where, because multiple speakers were recorded through a single device, the AI transcription identified the entire conversation as belonging to only one participant. They noted similar transcription errors in previous courses, such as those by Ron Shaw and Mr. McDonald, where the speaker attribution was incorrect ([02:03:25](#02:03:25)).

* **Priority System Issues**: The team identified the top priority as the payroll system, which currently functions as a spreadsheet. Michael Flynn detailed specific system failures: the primary bank account has not been reconciled in a year and requires manual reconciliation; promotions account for 45% of sales but the underlying logic is flawed; and a deprecated custom promotions engine causes data leakage ([02:04:36](#02:04:36)). They categorized these issues as margin-impacting rather than merely annoying ([02:05:41](#02:05:41)).

* **Strategic Assessment Delivery**: The group discussed the ideal delivery format for assessments, agreeing that while they have used PowerPoint presentations in the past, a hybrid approach of using slides during the call and delivering a more detailed document afterwards is preferred. They acknowledged that the "work item" document, which covers specific fixes and levels of effort, is more useful than a slide deck alone ([02:05:41](#02:05:41)).

* **Project Roadmap Strategy**: The team outlined a deliberate "stabilization" strategy: first stabilizing the foundation by fixing script conflicts that affect commissions and performance, then addressing the "bleeder" areas that cost labor and money, and finally shrinking the custom footprint to reduce future costs ([02:06:49](#02:06:49)). They clarified that the roadmap classifies tasks—such as script fixes, data fixes, or settings changes—because each carries different risks and execution requirements ([02:07:56](#02:07:56)).

* **AI Integration Planning**: Michael Flynn explained that they would not sell AI on a broken foundation; therefore, while AI planning is a year-one priority, it sits behind the stabilization work in the sequence. They emphasized that AI trained on non-reconciled data provides "confident wrong answers" and that the initial high-value AI implementation should focus on reporting ([02:08:50](#02:08:50)).

* **Next Steps for Engagement**: The team identified two immediate requirements to begin the project: confirmation of the identified priorities from the client and access to the production environment ([02:09:51](#02:09:51)). Michael Flynn noted that once production access is granted, the remaining discovery items can be closed quickly ([02:08:50](#02:08:50)).

* **Project File Management**: Taha Raja and Michael Flynn discussed organizational habits, with Taha Raja describing the use of folders and project-specific contexts for AI chats. Taha Raja explained that they maintain specific project chats, such as a "financial analyst" persona, which allows the AI to ground all subsequent conversations in the P\&L and balance sheet without needing repeated prompts ([02:13:04](#02:13:04)).

* **Documentation and NotebookLM Refreshing**: Michael Flynn and Taha Raja discussed the maintenance of their "collector doc" within NotebookLM ([02:19:40](#02:19:40)). Taha Raja explained that they move meeting recordings into customer folders and append them to a central file ([02:21:41](#02:21:41)). They verified that the source document had been refreshed to include the most recent notes from the 27th ([02:20:36](#02:20:36)).

* **Comparative Analysis of Assessment Documents**: Taha Raja reviewed the differences between two assessment documents: an AI-generated assessment and a "work item" document. They noted that the AI assessment was stronger in "epistemic discipline"—naming unknowns and citing sandbox limitations—while the "work item" document was stronger in project closure, including hours, dependencies, risks, and owners ([02:22:49](#02:22:49)). The team concluded that they should merge these approaches to create a document that is both thorough and ready for signing ([02:23:58](#02:23:58)).

* **Consistency and Data Discrepancies**: The team analyzed discrepancies between the documents, such as the count of scripts (4,500 vs 2,000) and address verification protocols ([02:24:58](#02:24:58)). Taha Raja noted that the AI assessment was likely more accurate as it had access to the MCP (Model Context Protocol), while other documents contained errors or transcription artifacts ([02:26:02](#02:26:02)).

* **AI System Instructions**: Taha Raja explained the role of the "Claude MD" file, which acts as a set of universal instructions for Claude projects, ensuring that the AI follows best practices and maintains context ([02:27:28](#02:27:28)). They stated that this file is fundamental to how Claude operates and that they also utilize a "Context MD" file to help the project maintain its position and instructions ([02:28:58](#02:28:58)).

* **Level of Effort Reporting**: The team discussed how to handle "Level of Effort" (LOE) figures in client-facing documents. They decided to draft everything with LOE flagged as "not final" rather than calibrating the menu manually or leaving it empty, allowing them to iterate on the figures later ([02:28:58](#02:28:58)).

* **Consulting Evolution and AI**: Michael Flynn reflected on the rapid evolution caused by AI, noting that projects they worked on three months ago already feel outdated ([02:32:14](#02:32:14)). They hypothesized that AI is compressing time and accelerating evolution, making the traditional consultant—who simply "turns things on"—extinct, while elevating those who can architect solutions based on operational business knowledge ([02:34:19](#02:34:19)).

* **Real-World Application: Custom Data Dashboards**: Michael Flynn showcased a custom solution created for a client, using a custom Suitelet to query the database directly rather than relying on NetSuite's native rendering. This provided the client with instant filtering of customer sales history and access to critical information like online resource access codes, which were previously inaccessible ([02:38:47](#02:38:47)) ([02:45:45](#02:45:45)).

* **Real-World Application: Manufacturing Production Reporting**: Michael Flynn shared an example of a production manager with no technical background who used Claude to build a sophisticated production report in three or four hours ([02:43:44](#02:43:44)). This report allowed the manager to analyze demand transactions and running quantities, effectively bypassing rigid, traditional development processes ([02:42:50](#02:42:50)).

* **Technical UI/UX Implementation**: The team discussed the technical implementation of the custom data dashboard, which utilizes a jQuery DataTables plugin on top of a script to handle large datasets. They noted that this approach allows for high-performance filtering and sorting, solving the client's problem of needing historical sales data that would otherwise be difficult to query in a standard NetSuite environment ([02:47:35](#02:47:35)).

* **Data Normalization Challenges**: Taha Raja and Michael Flynn discussed the difficulty of normalizing data between legacy systems and NetSuite. They described the process of loading disparate data into unified tables, creating materialized tables to cache the information, and validating the output against existing reports to ensure accuracy ([02:49:33](#02:49:33)).

* **Future Constraints and Connector Accessibility**: The team addressed the issue of creating MCP connectors in new accounts, noting that they currently have to set them globally. They agreed that this would be a bottleneck but concluded that as long as they establish the connections during the initial setup phase, they could proceed with the work ([02:57:39](#02:57:39)).

* **Custom Model Context Protocol Configuration**: Michael Flynn and Taha Raja discussed the necessity of having "owner" status to create custom Model Context Protocol (MCP) integrations for client assessments. They confirmed that establishing these connections to "Power Cloud" allows for automated processing of transaction volumes and performance data, although connectivity may require specific customer permission or admin access ([02:58:30](#02:58:30)) ([03:01:41](#03:01:41)). The team agreed to proceed with these setups for specific projects, using project dashboard downloads as a backup method for gathering hour data if direct MCP connections are unavailable ([02:59:55](#02:59:55)).

  ![][image1]

* **Meeting Documentation Issues**: Michael Flynn identified a lack of standard AI-generated summaries and transcriptions for a recent call, noting that they could not locate the expected file. Justin was tasked with checking the calendar event for the price tag printing meeting to locate the internal file or notes, as the team needs to rely on accurate transcriptions for their assessment work ([03:02:49](#03:02:49)).

* **Shinasty Company Profile**: The team reviewed the background of Shinasty, a Boulder-founded apparel company established in 2014 that specializes in underwear, swimwear, and casual apparel with a matching subscription model. Key characteristics include a business model that is 90% e-commerce—spanning Amazon, wholesale, and owned retail—and a self-fulfilled distribution operation based in Denver that utilizes a custom NetSuite-based warehouse management system (WMS) and shipping rate service ([03:04:07](#03:04:07)).

* **Operational Challenges at Shinasty**: Michael Flynn and the team identified several core operational pain points, including an 8 to 10-day monthly close process, manual reconciliation requirements for Amazon settlements, and warehouse system conflicts leading to overselling during peak periods ([03:05:26](#03:05:26)) ([03:17:12](#03:17:12)). They also noted that the company maintains an inactive "RF Smart" installation alongside its live custom warehouse system, which complicates system maintenance and license management ([03:05:26](#03:05:26)) ([03:47:46](#03:47:46)).

* **Customer Record Management**: The team discussed the impact of Shinasty’s customer database, which contains 1.84 million records, effectively creating a one-to-one ratio with Shopify orders ([03:06:30](#03:06:30)). There was a consensus that this volume creates performance issues when loading records, and the team suggested potential strategies such as deactivating customers without recent activity to prevent system strain, rather than attempting a large-scale merge which could destabilize the platform ([03:07:48](#03:07:48)) ([03:44:20](#03:44:20)).

* **Settlement and Payment Workflows**: A recurring issue was identified regarding Amazon and Shopify settlement flows, specifically the lack of a proper customer deposit workflow in NetSuite. Michael Flynn observed that because the current process records sales orders without deposits and waits for fulfillment to generate a cash sale, it creates a "cash mismatch," making reconciliation difficult; the team recommended aligning the workflow to reflect real-world payment collection practices ([03:10:03](#03:10:03)).

* **Wholesale Inventory Syncing**: The team analyzed the inventory synchronization issues, noting that syncing too frequently between Shopify and NetSuite can lead to overselling if the sync runs during a two-minute window where NetSuite has not yet processed a fulfillment ([03:13:16](#03:13:16)). They suggested that for Shopify-driven inventory pools, a once-daily sync might be sufficient to avoid these "out-of-date" windows, as NetSuite should naturally decrement available inventory once an order is dropped ([03:14:21](#03:14:21)).

* **Assessment Terminology and Methodology**: The participants debated the nomenclature of their consulting process, with Taha Raja suggesting a shift from "Rapid Assessment" to "Fast Discovery" to better reflect the collaborative nature of the work. Michael Flynn agreed, acknowledging that on-site discoveries provide tangible insights that remote assessments often miss, though the team committed to continuing the current remote engagement model as requested by the client ([03:16:22](#03:16:22)).

* **Proposed Project Phases and Estimates**: The team outlined a multi-phase proposal for Shinasty, starting with a foundational phase that includes establishing a NetSuite APM performance baseline, repairing purchase clearing, automating month-end processes, and stabilizing Amazon settlements ([03:17:12](#03:17:12)) ([03:38:18](#03:38:18)). They estimated the initial phase at 24 to 40 hours, emphasizing that this work is discovery-led and intended to make the custom NetSuite environment cheaper and safer to modify without requiring a platform change ([03:18:28](#03:18:28)).

* **Critique of AI-Generated Documentation**: Michael Flynn and Taha Raja reviewed the AI-generated assessment document, criticizing its excessive verbosity and the inclusion of unnecessary "fluff" quotes from previous interviews. They concluded that while the AI produces a useful draft, it lacks deep domain knowledge—such as understanding why certain workflows like customer deposits were missing—and needs to be more concise and factual to serve as a professional consulting deliverable ([03:21:10](#03:21:10)) ([03:23:19](#03:23:19)).

* **AI Prompting Strategies**: The discussion shifted to the necessity of improved prompting techniques to achieve higher-quality AI outputs, with participants agreeing that "non-binary" intelligence requires detailed, context-rich instructions rather than vague requests ([03:25:35](#03:25:35)) ([03:28:40](#03:28:40)). Michael Flynn emphasized that to avoid "garbage" results, the team must incorporate explicit instructions into their prompts—such as requiring the AI to perform planning, ask clarifying questions, and test assumptions—rather than trusting the output as absolute truth ([03:26:41](#03:26:41)) ([03:29:35](#03:29:35)).

* **Review of Generated Document Introduction**: The team evaluated the AI's introduction to the Shinasty assessment, noting that while the high-level summary of the company’s history was accurate, the document incorrectly suggested the client was considering leaving NetSuite ([03:31:43](#03:31:43)) ([03:33:50](#03:33:50)). They verified through pre-sale interview notes that leaving the platform was never discussed and concluded that the AI had hallucinated this conclusion based on a misinterpretation of NetSuite renewal conversations ([03:36:02](#03:36:02)).

* **Financial and Infrastructure Verification**: Participants confirmed that Shinasty does not utilize "OneWorld" or subsidiary accounting structures, contrary to what some initial reports might imply ([03:40:21](#03:40:21)). They also discussed the client's subscription model, noting that it appears to be managed as a recurring order process rather than a true subscription billing system within NetSuite, which explains why the client uses non-inventory items and deferred revenue reclassifications to handle the financials ([03:41:18](#03:41:18)).

* **System Landscape Verification**: The team reviewed the verified system landscape for Shinasty, confirming the use of Celigo, SPS Commerce, and a live market time integration for wholesale ([03:46:32](#03:46:32)). They noted that while an "RF Smart" installation exists, it remains dormant, and they questioned whether the client is continuing to pay for the license despite its inactivity, suggesting that these legacy components contribute to the system's overall complexity ([03:47:46](#03:47:46)) ([03:49:59](#03:49:59)).

* **Payment Gateway and Scripting Landscape**: Michael Flynn and Taha Raja examined the client's payment and scripting environment, noting the use of multiple redundant tools like Nimbus, SolPay, and CyberSource. They noted that "EPS" was identified as an older name for Nimbus, and they expressed concern that the proliferation of active scripts—such as a 29-script E-Pay suite—was causing latency and management difficulties, particularly for wholesale payments ([03:08:58](#03:08:58)) ([03:51:01](#03:51:01)).

* **Wholesale Allocation and Discount Handling**: The team investigated specific system pain points, including wholesale allocation errors where committed stock is stripped from orders and issues with discount application ([03:53:15](#03:53:15)). Regarding discounts, they noted that the AI reported a limitation where NetSuite allegedly cannot handle order-level and line-level discounts simultaneously, though the team expressed skepticism and identified this as an area requiring further investigation into the client’s custom script logic ([03:54:26](#03:54:26)).

* **Payment Processing and Data Quality**: The participants discussed payment latency issues caused by the system loading entire customer histories during payment processing and noted that incomplete data from "Monday.com" forms often causes payment failures ([03:55:31](#03:55:31)). They identified this as a clear area for improvement, noting that moving away from external forms or implementing better error handling could resolve these silent failures, which currently complicate the reconciliation process ([03:56:28](#03:56:28)).

* **Audit of Client System Issues**: Michael Flynn identified several technical and operational issues, including fragile bill imports that disrupt warehouse performance, unused diagnostic tools, and a lack of native fixed asset modules in the current system. They noted that the system appears to use deferred revenue in a non-standard way, suggesting funds are collected upfront, and highlighted concerns regarding late transaction postings after period locks ([03:57:22](#03:57:22)) ([04:26:15](#04:26:15)).

* **Document Layout and Formatting**: The participants discussed the preferred layout for assessment documents, settling on a hybrid model that uses a verbose text section for detailed issues, supplemented by a concise table for summary data. Michael Flynn noted that this approach balances readability with depth, and they agreed to maintain consistent formatting across all task lists to avoid confusion ([03:59:10](#03:59:10)).

* **Level of Effort and Discovery Expectations**: Michael Flynn established a preliminary Level of Effort (LOE) range of 100 to 150 hours, excluding "To Be Determined" items, noting that this serves as a baseline rather than a final total. They emphasized the need to clearly communicate to clients that because these assessments are based on remote sessions rather than full on-site audits, some topics will require deferred analysis and additional discovery ([04:01:10](#04:01:10)).

* **Client Communication Regarding Sandbox Refresh**: Michael Flynn and Taha Raja discussed the need to inform their contact, Rod, about the rework required following a sandbox refresh. Taha Raja noted they had forwarded the information to Rod but needed to follow up with a formal email; the team agreed to include them on the email to ensure clear communication and to leverage details from the call to frame the request ([04:03:54](#04:03:54)).

* **Critique of AI-Generated Documentation**: The team compared two different versions of assessment documents, observing that while longer documents provided more detail, they lacked the necessary conciseness for client consumption ([04:04:39](#04:04:39)). Michael Flynn argued that the team must train their AI tools to be succinct and "to the point," as current client bandwidth does not allow for 20-page documents; they stressed the importance of identifying and focusing on core issues ([04:05:36](#04:05:36)).

* **Project Execution and Task Management**: The team discussed the role of the assessment document as a guide for subsequent project phases, including the use of the Model Context Protocol (MCP) to automate the population of task management tools like Asana. They confirmed that the "real work" of creating tasks and sprints begins after the initial rapid assessment document is finalized ([04:10:03](#04:10:03)).

* **Documentation Discrepancies**: During a comparative review of the AI-generated documents, the team identified several discrepancies, including conflicting information regarding payment portal ownership, Loop return automation, and the status of RF Smart ([04:16:03](#04:16:03)). They also noted that certain topics, such as payout import automation, inventory packaging strategies, and specific reconciliation workstreams, were missing from the AI output and needed to be manually addressed ([04:17:12](#04:17:12)).

* **Handling Supplemental and Low-Priority Issues**: The group discussed how to categorize and store secondary issues that are not critical enough for the main report but remain relevant for future engagement ([04:29:19](#04:29:19)). They concluded that these "fast follow" items should be included in a less verbose section of the document without formal Level of Effort estimates, serving as a roadmap for after the primary, high-priority issues are resolved ([04:30:37](#04:30:37)).

* **Refinement of AI Process**: Michael Flynn proposed iterating on the prompt and template for the assessment document overnight, incorporating feedback from the current call to ensure better performance in future runs ([04:23:04](#04:23:04)) ([04:31:35](#04:31:35)). The objective is to create a tool with built-in checks and balances that produces high-quality, succinct content while minimizing manual intervention ([04:24:13](#04:24:13)) ([04:31:35](#04:31:35)).

* **Technical Implementation of Changes**: The participants clarified that while the Model Context Protocol (MCP) handles some integrations, the deployment of scripts, custom fields, and configurations is managed via the SuiteCloud Development Framework (SDF) ([04:34:22](#04:34:22)). They noted that SDF operates independently of MCP, allowing them to push changes directly into the NetSuite account even without an MCP connection, utilizing OAuth tokens for authorization ([04:35:26](#04:35:26)).

* **Project Schedule and Logistics**: The group scheduled the next day's work to begin at 8:00 AM, with the goal of finalizing the revised assessment document by early afternoon before their next executive call ([04:37:24](#04:37:24)). They agreed to keep the current work schedule flexible but prioritized completing the assessment to avoid delaying progress on the Shopify and NetSuite integration work ([04:39:33](#04:39:33)).

*You should review Gemini's notes to make sure they're accurate. [Get tips and learn how Gemini takes notes](https://support.google.com/meet/answer/14754931)*

*How is the quality of **these specific notes?** [Take a short survey](https://google.qualtrics.com/jfe/form/SV_5bXzKQfylMIhSXc?confid=ochUdjy75eN7rFN5gv8cDxIROAIIigIgABgBCA&detailLevel=standard&hasImages=True&entryPoint=footerMain&isGoogler=False) to let us know your feedback, including how helpful the notes were for your needs.*

# **📖 Transcript**

Jul 28, 2026

## **AI Summit \- Transcript**

### **00:00:01** {#00:00:01}

**Michael Flynn:** just mute and everything, right? Uh, you guys should mute. I think mine will um automatically merge whatever the feature is. Yes, mute speakers, but T and I don't need to mute yet. Do we both have choppers? So, yeah.

**Taha Raja:** Okay, audio

**Michael Flynn:** Are you muted?

**Taha Raja:** muted.

**Michael Flynn:** The speaker

**Taha Raja:** All right.

**Michael Flynn:** you said,

**Taha Raja:** I said word.

**Michael Flynn:** I think you still want your speaker.

**Taha Raja:** Okay.

**Michael Flynn:** Okay.

**Taha Raja:** Okay.

**Michael Flynn:** Okay.

**Taha Raja:** I'm taking notes. All right.

**Michael Flynn:** All right.

**Taha Raja:** Um Okay. You want to just kick off?

**Michael Flynn:** Okay.

**Taha Raja:** We don't have any water or anything in there.

**Michael Flynn:** We do. Water is so

**Taha Raja:** Logistically, obviously, I'm sure you guys have seen the restroom.

**Michael Flynn:** here right behind this wall.

**Taha Raja:** There's a restroom in that door corridor right there.

**Michael Flynn:** Uh

**Taha Raja:** There is a coffee station and a water station right there. And then there's some more restrooms in that corridor down there on the other side.

### **00:01:38** {#00:01:38}

**Taha Raja:** All right.

**Michael Flynn:** All right. So, got a couple things here and I I will read through it, but I think the big picture today is or this week is it's been really obvious to me how we use AI on the development side. Black and white do questions. There's a lot of stuff we can do with development. There's a lot of stuff we can do with testing. The bigger question that I have been trying to answer since before spring training even and I think I might have said this at spring training is how do we make use of AI on the consulting side. Um some of you guys have seen some of the stuff I've done with like my own personal daily organizer. I think Justin has spun up his own version of it. Um Justin's done some notebook LLM stuff that's pretty similar in recent times. Uh Imran, I know you have seen my tool that I've kind of just a prototype version of the tool to evaluate uh rapid assessments or really recordings of any kind and take it forward.

### **00:02:55**

**Michael Flynn:** And that's kind of what we'd like to try to work through this week. But what I don't want to do is just build something and say, "Hey, here it is, guys. Go use it." I want you guys to tell me what it is that you want and how you think this can fit into your daytoday consulting life. So, we're going to talk about through this in a few ways. We're going to consider like what we're doing before meetings, which is kind of a lot like what you and I kind of already did. surfacing some questions. We're going to talk about what the AI can do when we come back from meetings, which is what a lot of us have done building rapid assessment documents out of recordings. Um, and we're going to try and take it a step further. Can we produce SDF documents out of that or SDF projects, sweet cloud development framework projects which are actually deployable into Netswuite to actually execute on the things that we

**Taha Raja:** some I'm

**Michael Flynn:** do and then can we use this in an ongoing basis?

### **00:04:06** {#00:04:06}

**Michael Flynn:** If we're recording every call that's great, what can we do with it? How can we make this actionable and how can the tool how can we build tools that actually take the action? Right? Big picture, what I want out of all of our consultants is for you guys to consult and to be consultative, to ask great questions, to lead customers down the path to great answers. I want less of you guys having to sit at keyboards and bang keyboard bang numbers into Excel and produce import files and make custom fields

**Taha Raja:** and tweak settings.

**Michael Flynn:** and it's like that's not where you're val valuable in my opinion. You guys are valuable for your brains. You guys are valuable because you know what Netswuite's capable of. You understand how businesses work and you can guide your customers to making to you can ask good questions of the customers which will guide them to the path of making good decisions.

**Taha Raja:** And then I think

**Michael Flynn:** In a lot of cases, we can have tools that just go ahead and execute those visions and you can move on to guiding the next

### **00:05:18** {#00:05:18}

**Taha Raja:** it

**Michael Flynn:** customer in a meeting to what they're going to do. Let me just pause there. That's my big picture of where I'm trying to get to. And this week is about seeing how far we can like trying to put this vision together both with some prototypes that are going to be partway successful I actually think and ultimately to turn these thoughts over to our newly hired AI developer to actually build this into a one or multiple like actually functioning tools. So part of what I'll ask is even as we go into this like what should the interface be right like right now I have something that works in cloud code but is there a more intelligent way of interacting with this that we'd like to consider when we actually go and have a professional start to build this out for us? I'd like to ask a context question. Yeah, please. Is is and you you started kind of um hitting on some of those details. Everything is changing really really fast.

### **00:06:38** {#00:06:38}

**Michael Flynn:** Um and I expect that's going to be a constant is change coming up. And I'd like to get yours and TA's perspective on what you're seeing. How do you think the consulting business, our business will fundamentally change? because I think that's probably one of the drivers for this summit is that um you know for example even in our own business we've hooked up the MCP connector and we're now me and my warehouse manager are now beginning to we're just dipping our toe into the pool really for the first time. Todd has already been forging ahead and is way ahead of us. Our other business partner Steve's already forging way ahead of us on Shopify and our relationship with that. And even as we open one door for one simple thing like how can I find available fin fins if I can get AI to do that every door you open has six more doors in the room and you're like oh s\*\*\* I didn't think about this application this application this application and so like immediately in my own business where I've used save searches heavily for almost two decades now I'm going I could absolutely be in a situation six months from now or a year from now where I never touch another save search again.

### **00:07:54**

**Michael Flynn:** So this and even to your point about you know uh creating custom fields and things like that I I think the list of all these things that we did as maybe process steps um are fundamentally changing forever. Yeah. And so then it's like how do we take a step back and how do we how do we best utilize how do we embrace the technology and best utilize where our where our real value always was in the first place. Yeah. Which I think is what you're That is the big that that I love that last part of your sentence because I think that's true. I think I think our value I think all of us have probably thought of ourselves as technologist or tech people. But I actually think our real value has actually always been in the merging of understanding the technology and understanding the business and being able to think through these problems. And I think that AI is just changing like changing the weight of that, right? If that was 65% through true through and 35% of this really was a technical job before.

### **00:09:08** {#00:09:08}

**Michael Flynn:** Yeah. The tech stuff is now easy. The tech stuff is no longer a barrier. So, I think your value in being an expert and being able to guide your customer, yeah, is really where the answers are at. Um you know we are exploring new billing models as part of this as well. Um I uh you some of you guys have probably been on deals where we've seen this where we're questioning can we deliver implementations as part of a managed service package. Um basically having a power cloud subscription that does everything including implementations. Um so a lot of things we are exploring from the business side as part of this but I think you hit the nail on the head. Our value is our knowledge of business and how these businesses, especially the ones that we're good at like fashion and distribution and stuff like that and our knowledge of the technology because one thing that is true that has always been true of tech and was still true with AI is the oldest axiom in the world is garbage in garbage out.

### **00:10:21**

**Michael Flynn:** Mhm. You have to be able to, even though AI can do this for you, you have to be able to give AI a good instruction. You want to build the world's most complicated script. Well, you still have to give it a prompt that explains how the puzzle pieces are going to fit together, why you're doing this, that, and the other thing. And yes, it can. You should see some of the stuff. I mean, I'm sure you've seen MC at FMW. Some of the stuff TA has built for us at PowerCloud is fantastic. I think you guys all know at this point that I with zero input from the development team built our stripe integration from scratch with AI. I built um a couple of other things uh nothing else that we're using in production I don't think but without any so like it is possible to do these things but you have to understand what you're putting into it to get good quality out that front half is not changing you do have to know Netswuite on some level and you do have to understand the best business practices so that's why I would say the consulting half of our business is where our value still is and is going to be.

### **00:11:43** {#00:11:43}

**Michael Flynn:** Like, I'll tell you, there was a time when we first started this where you could go on Fiverr and find like low-level scriptors doing work for like 20 bucks an hour. and they didn't understand a single thing about business, you had to be very very exact in the direction that you gave them. Their job is gone. That's already over. Oh yeah. Like if you're going to be that exact, you could just be that exact to Claude and you're going to get the same results and that that is going to shift. Like that is going to that's starting way down here with the $20 scriptor and it's going to come up. But people who can ask good questions and surface good solutions, that's always going to be a job in my opinion. And that's so I want to create more time for you guys to do that and have more of the technical stuff done for you is is the goal here. So So in the beginning you said that

**Taha Raja:** build some tools out of this week's sessions, right?

### **00:12:54** {#00:12:54}

**Michael Flynn:** Yes. What is an example of what? Sure. So,

**Taha Raja:** So,

**Michael Flynn:** let's see.

**Taha Raja:** how about

**Michael Flynn:** The Claude thing that you and I worked on for I know it was a pre-sale or it was a previsit

**Taha Raja:** the

**Michael Flynn:** situation, right? And we're going to pull that up actually shortly here and look at it. That that actually will take you. So, you use that before you ever went out there. It surfaced some questions for you to ask. I used that same tool on Tapperman's when you guys came back. Um I actually I shared with you the results of it way back then and it was there were goods, there were bads. Um you know we compared it to what you guys had done manually and I don't think it was at that point as good as what you guys had done manually. But the question, you know, but part of what we'll do is we'll tweak it. And then the third step from that is that same tool should actually be able to produce deployable changes to a Netswuite account that we can implement, including some settings being set, some records being created, things of that nature.

### **00:14:09**

**Michael Flynn:** Do do we know the limitations of what we can and cannot control?

**Taha Raja:** I know we can get like fields and stuff like that. The biggest

**Michael Flynn:** is the accounting preferences cannot be set via SDF right now.

**Taha Raja:** limitation

**Michael Flynn:** Um like enable features can we can turn things on and off with enable features. We can create custom records, custom fields, core scripts. Yeah, that um I've seen that happen in deploying scripts and stuff where I've started the project in cloud code and obviously we need another we need a custom field rather than go creative just pushing it. So first of all um we need to take us a couple of steps back on what we trying

**Taha Raja:** accomplish today,

**Michael Flynn:** to

**Taha Raja:** right? What we're really trying to accomplish today is to get an understanding of what can be done. The interface that you guys are using today for plot.

**Michael Flynn:** is like kindergarten. What we're about to build is a professional version of an interface where

**Taha Raja:** will have a power cloud interface with a multiple agents that are specifically designed to do specific things almost like a CGO type of deal like power cloud.

### **00:15:16** {#00:15:16}

**Taha Raja:** Yes. and and and that's the agentic developer is going to do that and it will automatically choose on the back end which model to use on the back end for what type of questions how many tokens are going to get deployed all these this is what an agentic AI developer does today what you use today with bringing up the cloud cloud interface is

**Michael Flynn:** the starting point of that.

**Taha Raja:** is you examine

**Michael Flynn:** But you know

**Taha Raja:** professional level AI tools today like for example Yesterday I asked my daughter to say, "Show me your medical AI tool that she uses every day." She's part of the beta group at University of Washington where AI does even diagnostics now. Okay, this is like Star Trek s\*\*\*. She showed me like how it works. She the in the back end is

**Michael Flynn:** Anthropic engine, but the front end I can't I couldn't even recognize

**Taha Raja:** I what the hell is this? She said this is what I use every day.

**Michael Flynn:** it.

**Taha Raja:** Is it just is it a portal?

### **00:16:16**

**Taha Raja:** It's a portal with ability to have uh sensor data come in. Y medical results come in from the lab conversation.

**Michael Flynn:** portation the whole thing. So basically then

**Taha Raja:** She's talking to the to the patient. She was like asking me questions. Yeah. Okay. So my doctor Yes. two days ago told me, "Hey, you need to get on GLB1." I was like, "Okay." So I called my daughter. She said, "Okay, I'm going to show you how this works." She turned on she started having

**Michael Flynn:** CL

**Taha Raja:** convers

**Michael Flynn:** like

**Taha Raja:** GLP-1 over 10 years, 15 years, 30,

**Michael Flynn:** years versus taking GLP-1 with the risks associated with the medication. And why

**Taha Raja:** why you should either take it or not take it. To be fair, not very much different than Mike's brainy. No, it is not. As far as the app, it is not. That's exactly what he Mike's brain is like. You're ingesting a bunch of stuff.

### **00:17:20** {#00:17:20}

**Taha Raja:** Yes. And you and you have an app that you can ask all that stuff. So has everybody done the

**Michael Flynn:** Have I demoed that to everybody or not? I knew when I said it. I was like, I I

**Taha Raja:** same thing. I do I use it. Yeah, I knew you had one.

**Michael Flynn:** I

**Taha Raja:** And it's a mobile I even have it mobile enabled where now I'm able to reply to emails from within it. It will look at all the meetings I've been invited to, whether I attended it or not, and all my project meetings that you guys do. It tells me what you guys discussed. So, that meeting, we should not take his name anymore.

**Michael Flynn:** Yeah. Don't tell Taha. for Ron and Imran who haven't seen it. I'll just pull it up real quick. This is my version. T and I built ours independent. So while while before he what I'm trying to say is that the objective is that you know we have to take this.

### **00:18:09**

**Michael Flynn:** So I don't even know what I don't know. That's the purpose of this movie

**Taha Raja:** Meaning is to brainstorm and talk to think about what can be possible. Yeah. Again I look at the analogy. Imagine if you have never driven a car,

**Michael Flynn:** because

**Taha Raja:** seen a car, don't know what a car is. And suddenly a car appeared in your driveway and you said, "Now this is your new transportation method." You would have to experiment. You have to think about what you want to do because now you're going to be able to go 40 miles in 30 minutes as opposed to taking two days. But that car that to be fair that that car also has a bunch of features that you don't even know about. I understand. No, no, I know. So that's why it's similar. Yes. And and so that's what I'm saying is this is the this is the opportunity that we have to think about the starting point that we have talked about internally in the leadership at Parl is okay all that grunt work that we do is gone.

### **00:19:08**

**Michael Flynn:** We have to make that assumption.

**Taha Raja:** Yeah that's the premise.

**Michael Flynn:** That's the premise. So, so, so let's like going back to the shinasty

**Taha Raja:** Take it at our own example now.

**Michael Flynn:** example,

**Taha Raja:** So right now if it's a new project right

**Michael Flynn:** there are few things I have to do.

**Taha Raja:** uh you

**Michael Flynn:** Everyone has to do themselves, right? We have a kickoff call. We have some um call.

**Taha Raja:** know high level issues the sales transfer trans uh and some other

**Michael Flynn:** Uh then I have to go into their instance do some digging myself which we used

**Taha Raja:** work right now moving forward using that

**Michael Flynn:** in that we have to put in too much prompts.

**Taha Raja:** tool

**Michael Flynn:** But moving forward with that agent AI I'll just

**Taha Raja:** input certain information some transcripts maybe it will automatically connect the transfer suppose if I tell the customer I and it will give me what the on my discovery or rapid

**Michael Flynn:** questions I should ask

**Taha Raja:** assessment it will recommend it's not everything yeah of course of course without me having to go looking how many licenses they have how many transactions they have it will

### **00:20:07**

**Michael Flynn:** you read everything give me the data suggested questions agenda so I don't have to spend like at

**Taha Raja:** automatic

**Michael Flynn:** least two hours doing all that good

**Taha Raja:** that's just one very basic example just trying to I think that's that's

**Michael Flynn:** example and I think that's the way I'm envisioning it.

**Taha Raja:** a

**Michael Flynn:** But part of what we're doing here is making sure that we're all on the same page and that that's what we want out of the Yeah. And you guys are on the field

**Taha Raja:** latest and greatest right I I've not been on the field for about I don't know a year maybe

**Michael Flynn:** at

**Taha Raja:** and you know uh a lot has happened in the one year so additional feedback of what you feel that are blockers right now that you have to do

**Michael Flynn:** Could be helpful.

**Taha Raja:** manually ually maybe we add his features and like Juan suggested that you know this thing is moving at a rapid rapid rate. what we envision today, six months from now, we might say, "Well, s\*\*\*, scrap this and add that. But but we've got to start moving towards like I was

### **00:21:05** {#00:21:05}

**Taha Raja:** suggesting yesterday in the call, we have to have a culture of AI being an integral part of our workflow. Y every time we have a question or concern or issue, AI needs to be part of the formulation of you working towards an answer, right? Because if we don't do that, uh, you know, it's like I'm refusing to drive a car to transport. Well, and I you had a good example of that even just for now.

**Michael Flynn:** That's something that triggered

**Taha Raja:** And we can maybe even use it as an example. You just said something about I don't have to ask how many licenses or concurrencies they have, blah, blah, blah. Well, Peppermint's has all these issues with their scripts because they have too they probably have too many scripts anyway, but they're also wondering based on their transaction volume and their concurrencies and all the all the other technology stuff like their processes and s\*\*\* like that, are they configured correctly? Are they are they underconfigured? I don't really subscribe or underconfigured I guess probably undersubscribed from an perspective.

### **00:22:11**

**Taha Raja:** Yeah. Like having enough processing power and space whatever. Yeah. Um, I don't really know how to answer that question and I initially was like, well, let me just bring it here and ask you guys here. But in reality, why not just ask throw that in Claude? Yeah. And in that specific case, you know, you could say to Claude saying, "Use this. Put APM in the system if it doesn't have it. Interpret the data from APM, right? have clog use their APM tool, Netswuite's tool which gathers a lot of data and pull it back and analyze it because the thing is you know the again the the the possibility of analyst one thing that I'm seeing consistently unfortunately still within

**Michael Flynn:** our teams.

**Taha Raja:** our we don't have this AI first

**Michael Flynn:** Is that

**Taha Raja:** approach and AI first approach needs to be an integral part of our culture. Because if we don't do that, guys, there's continue to use my

**Michael Flynn:** like me saying I'm not going to accept my car.

### **00:23:14** {#00:23:14}

**Michael Flynn:** I'm

**Taha Raja:** horses. Yeah. No, I think there's buggy. That's fine. How many issues do you have? No, no, that that's fine. Look, I mean, if if companies and this will happen, right? Companies will say no. That's okay. If companies say no, we can tell them, hey, we'll be happy to do it the traditional way, but it's going to cost you number of hours. It's interesting that Scott came up

**Michael Flynn:** The previous guy there was the first guy we ever heard tell us that he doesn't want to pay the

**Taha Raja:** because

**Michael Flynn:** deo. The CEO is the first guy who we ever encountered to tell us that he's not going to pay full price for development anymore because he knows AI can do this stuff. Yes. So, AAD in

**Taha Raja:** both are very pro AI.

**Michael Flynn:** a

**Taha Raja:** It'll be a simple conversation with the mayor. I have a very good relationship with them, but I don't use it because there's no point in throwing their own team members under the bus.

### **00:24:14**

**Taha Raja:** But if it comes push to shove, it'll be a simple conversation. No, because I asked him about MCP configuring MCP. He was like, "Ah, let me think about it, man. The data and you know, I mean, yeah, he was like in

**Michael Flynn:** He did not say yes. All the customers I have asked so far about MCT, oh yeah, sure. Let's go ahead. that

**Taha Raja:** was the one question like why do we need to do it? Let's get the data fixed first. Sounds like a job security problem. We got a little I was on vacation

**Michael Flynn:** It looked like there was a little push back from one of the food banks to Well, the food bank has a Got it.

**Taha Raja:** problem with compliance this

**Michael Flynn:** They They were just worried about compliance. They said, "Look,

**Taha Raja:** question.

**Michael Flynn:** if you answer

**Taha Raja:** You could go ahead because they they have government grants. Yeah, that makes sense. So yeah.

**Michael Flynn:** compliance like it's going to happen."

### **00:25:01**

**Taha Raja:** So we're going to so we're going to run into some

**Michael Flynn:** Privacy and compliance.

**Taha Raja:** personal issues is a different thing but

**Michael Flynn:** I mean, I am not a thousand% AI is all good and there's nothing wrong with it.

**Taha Raja:** anyways

**Michael Flynn:** I I've got major concerns with it, but in the technology world, I I don't really in my business life, I don't really have the luxury of taking principled stands on that stuff. I' I you know, yeah, I've got a decade left in my work career. I need to make money. If he has a decade, that means I have zero. Yeah. So, well, the thing is like the the fear is like, oh, and I don't

**Taha Raja:** I don't know this happened but like we're becoming so reliant on it and what happens if a year from now the government anthropic whoever is like hey f\*\*\* you guys you're done well no here's what's going to happen and no more AI it's Now people are strapped. Well, here what will happen? So couple of things just from a business perspective the ease or the inexpensive aspect of AI is planning to is going to go away.

### **00:26:12** {#00:26:12}

**Taha Raja:** Yeah. Yeah. 100%.

**Michael Flynn:** They're building

**Taha Raja:** Because investing billions of dollars into this and they have to recover that.

**Michael Flynn:** they're with the

**Taha Raja:** We've already started seeing it

**Michael Flynn:** late the fable model if you've been reading about that. Yeah, that that s\*\*\* is about to

**Taha Raja:** in but the thing is uh from a business perspective right we will have to factor that cost in yeah and that's just going to be part of reality here's what I would say to our team members and this is what I need you guys to put the input this week on you have to think of this as not that my work is getting reduced but how am I going to exponentially increase the ability to open 10 new doors and those doors are not visible today so you can't tell what those 10 doors are but what are the pathways you must take today to forge through that door to see the other 10 doors yeah that's the thing right and another example I will give you a very simple one go back to 1900 when there were no airplanes and you travel back and you tell somebody today in 2026 people fly from New York to London have two meetings and fly back the same day they would not even believe you.

### **00:27:32** {#00:27:32}

**Taha Raja:** Yeah. Yet today people do that and plan that because that door was open through airplanes. So this is the this is the opportunity. Now you know I think I may be completely wrong but there are some team members who are resisting not that necessarily this team here but there are team members where I feel like they're resisting because they think that either time is being taken away from them their jobs are about to go away whatever combination of anxiety that evolves that is also part of the equation of this team to figure out how do we encourage because we don't want to lose any team members

**Michael Flynn:** positive adoption,

**Taha Raja:** because they think that you know my my job's about to go cuz that's not happening.

**Michael Flynn:** right?

**Taha Raja:** What is happening is PowerCloud needs to be at the forefront of expanding our business in this area. Yeah. As far as

**Michael Flynn:** Gills like dampening and stuff like that.

**Taha Raja:** like

**Michael Flynn:** I you know I've heard the concerns and I think but I at least when I interact with it I just take the process of I read the entire output and I engage with the output and I I don't I don't know I don't feel as if in fact I feel like I'm gaining knowledge from from it.

### **00:28:53**

**Michael Flynn:** So, as long as at least in what we do, I mean, I understand it if you're like a radiologist and you just get a little lazy because it sees the tumors before you ever see them and Yeah. and stuff like that and it's just better. But I think if you always stick with a garbage in garbage out philosophy and you engage with the response as if it's I hate to personify it, but you talk to it like it's a person and you don't just, you know, trust but verify. I don't think you'll find yourself getting dull in those areas. No. And I think that's fair. I

**Taha Raja:** Because you you do have to still have some knowledge.

**Michael Flynn:** mean,

**Taha Raja:** You do have to still if you just take what it gives you,

**Michael Flynn:** yes,

**Taha Raja:** you're screwed.

**Michael Flynn:** those are the people that are doing those the people that are relying on it like

**Taha Raja:** Crutch are screwed.

**Michael Flynn:** a

**Taha Raja:** The people that are relying on the pool to make them more efficient are probably going in the right direction.

### **00:29:51** {#00:29:51}

**Taha Raja:** Yeah. My thing is I don't

**Michael Flynn:** just by habit really like the reason I didn't

**Taha Raja:** do the peppermint thing yesterday because I just didn't think about it. And my initial thought was let me ask if let me ask how I would determine this to you guys because that's what we've always done rather than just say immediately go to AI and and then thinks of this.

**Michael Flynn:** take the response and say what do you guys the end of the week I want you to think a little

**Taha Raja:** So I think for

**Michael Flynn:** bit about how that could be a smoother more obvious transition right like one thing one thing that I don't know that we're going to just use it vanilla as it is. But Claude just rolled out the ability for it to be part of your Slack channels. We don't use Slack, but envision Google chat. If it was just in your Tupper's project, and you just say, "Hey everybody, I'm encountering this project. How do I think about this?" And Claude is the first one who's going to reply to you,

### **00:30:49**

**Michael Flynn:** right? It's one of the members. Now, if we're moving this every month, now if we're moving this, if we're moving all this power, this brain power and processing power into our own tool, like think about like literally eyeballs wise, like what does that tool look like and how do we interact with it and how can we make it more proactive to just get involved in some of our stuff. Now, there's some considerations on the other side, too. We don't just want to burn tokens for no reason with this thing. We want to make sure it's jumping in appropriately and where we want it to. Like there's that's probably part of the agent development, right?

**Taha Raja:** Exactly.

**Michael Flynn:** Exact like,

**Taha Raja:** And

**Michael Flynn:** you know, we want to come out of here with a wish list essentially of like how we how we

**Taha Raja:** but

**Michael Flynn:** envision this working and how we envision interacting it. And I want you guys to get creative and to really open your minds to it. Like I built this.

### **00:31:49** {#00:31:49}

**Michael Flynn:** This is not There's some AI here. I AI does some of the work to do this. This is not AI is not living and breathing in here outside of my little chat feature here. Um the search.

**Taha Raja:** Yeah. So,

**Michael Flynn:** So just for Ron and Imran what the G.

**Taha Raja:** so

**Michael Flynn:** So this looks at same as Tahas every meeting that I'm invited to on my calendar. It um it it reads it ingests the Google transcript. It ingests my granola transcripts just in case um it's not your meeting. It's not my meeting. It looks at my Google chat and it looks at my email. I have not added in a sauna which Taha has to his um but it then figures out what tasks got assigned to me throughout the course of those discussions. Like I'll be honest, I've already forgot this one because I didn't write it down and I didn't make any note of it. But we were looking at some credit card statements and we said why does why are we getting charged for Canva?

### **00:32:56** {#00:32:56}

**Michael Flynn:** And it just said coordinate with Steve to clarify whether Emily should be using this tool or not because we have clogged. Um do you this is do you find that they that it's adding

**Taha Raja:** and tasks that are just like either I'll say duplicate very similar or it's pulling tasks that really aren't tasks for you is kind of Yeah. Okay.

**Michael Flynn:** At the moment, I would rather have that than the opposite because I am not a naturally organized person. So, I'd rather just check one off and say there's really nothing to do there. I I am I have a button in there to say learn that this is going to get an identif. Yeah, I also actually merge in here. I have a merge, but I don't have that. Yeah. So, it it it builds that and then feeds that into the back end. I almost wonder if you if you could if you could change

**Taha Raja:** and say if I dismiss it,

**Michael Flynn:** it.

**Taha Raja:** take that as a this doesn't apply thing.

### **00:33:53**

**Taha Raja:** Yeah. So, so this looked at all the sources you had given and gave you a list of tasks to do. You gave me a list of

**Michael Flynn:** It also has a list of all the meetings where I can go in and provide the summary

**Taha Raja:** tasks.

**Michael Flynn:** provides this, you know, pretty much similar to what you get, but I can also chat about it. Um, who? With Claude. So, I can say, "Hey, um, what is does it execute any task?"

**Taha Raja:** It writes emails.

**Michael Flynn:** Yep. Not Google chat. It doesn't write Google chats right now. I could probably, you know, we could certainly like if one of the task was to reply

**Taha Raja:** about something or inform them about something,

**Michael Flynn:** to and the drafts,

**Taha Raja:** you can just Yeah. So, right now, so that's what it's doing.

**Michael Flynn:** it's it's replying to emails, but it won't send them.

**Taha Raja:** I'm sure you can do that with the chat.

**Michael Flynn:** But you very protective about my

### **00:34:41**

**Taha Raja:** I'm

**Michael Flynn:** voice.

**Taha Raja:** very

**Michael Flynn:** So I don't like I don't want it proactively sending anything in any channel. But giving you a draft option,

**Taha Raja:** Yes. Yes. Yes.

**Michael Flynn:** let me just What days did we settle on for the AI

**Taha Raja:** So, I'm just gonna

**Michael Flynn:** summit? And it's going to come

**Taha Raja:** That's

**Michael Flynn:** back. So I can now basically chat with my own knowledge base that I've built here. And that's ultimately probably what this was meant to be is a knowledge base of my own stuff and what's going on. Some emails replies cued for review. Original thread proposed to reply norm questions. These are important to nail down. The short answer is yes. So okay. So and I can actually save the Gmail. You can adjust that email template like what what it

**Taha Raja:** Well,

**Michael Flynn:** wrote

**Taha Raja:** Mike can like reword it in his in better better in his words and then hit save.

### **00:35:51** {#00:35:51}

**Taha Raja:** Yeah. And it'll save

**Michael Flynn:** in your Gmail. You just go to Gmail send. Oh, for to send you have to go to Gmail and send.

**Taha Raja:** it.

**Michael Flynn:** Yeah. Yeah. I that Yeah. It probably wouldn't be hard to adjust that. So, it could actually be done from here. And what is this UI? This is This is a UI I built. It's running on a server. Yeah. So, I I have a I have a couple of things that I want running all the time. So, I bought a $4 server that's hosted in I forget what somewhere in Virginia. And uh and I just run it on there. Um, it's it runs through Cloudflare for managing security and login information. And it was actually really easy to set up. Like he gave you

**Taha Raja:** repository,

**Michael Flynn:** the

**Taha Raja:** but it's easy to go through the setup. But this is just an

**Michael Flynn:** of like what's possible.

### **00:36:42** {#00:36:42}

**Taha Raja:** example

**Michael Flynn:** And this is incredibly tip of the iceberg. Like this is one little talk about you. If you talk about

**Taha Raja:** interface and UI. I mean, I could see us building a Power Cloud portal and having each employee have this access built right into it. Yes. And add on to it obviously. And no, you have a project and you add the project in there. Again, I I don't want to get

**Michael Flynn:** far ahead. I have ideas, but I don't want to dominate the ideas here.

**Taha Raja:** too

**Michael Flynn:** But like there are things like should our whole project be run out of there? Should customers have access to it or not? Should customers see the AI portions of it? Like these are all it can potentially even replace a sauna, right? Completely. I Yeah.

**Taha Raja:** See, if we're going to do it,

**Michael Flynn:** If you're going to do it, do it. I can

**Taha Raja:** yeah, I think you can give access to the customers.

### **00:37:32**

**Michael Flynn:** kill.

**Taha Raja:** I would even then go far as to say maybe you don't give access to the customers, but there's an injection piece of it that puts this you've seen the the project management stuff in in Netswuite when like when Netswuite does the implementation, why can't we have that in there? the customers are in Netswuite. We want them in Netswuite. Put all their tasks and s\*\*\* in there. Yeah. But we don't have to interact with it there. You know what I mean? If it's if it's in our portal and we can set up the tasks and have it sync to to Netswuite and they interact with it there. Great. Yeah.

**Taha Raja:** access to it.

**Michael Flynn:** to a portal. I don't know. I don't know what's best,

**Taha Raja:** Oh,

**Michael Flynn:** but I think both of us are options and and that's what we're here to figure out today or this

**Taha Raja:** this week.

**Michael Flynn:** week.

**Taha Raja:** My perspective is like,

**Michael Flynn:** So my my perspective is like okay if if it could be to the point

### **00:38:23** {#00:38:23}

**Taha Raja:** okay, if if it can be to the point where they can in Netswuite and we

**Michael Flynn:** where they can do everything they need to

**Taha Raja:** can communicate effectively from that that method,

**Michael Flynn:** do

**Taha Raja:** but we have a portal that has much more tools. We don't have to be in Netswuite.

**Michael Flynn:** fine that's great less jumping around I think is to me is better always and I think for the customers it's better yeah I think there's some stuff worth discussing there because right now we're talking about Netswuite. Yeah. Um, we saw a demo of somebody who's already trying to do this and quite frankly, we weren't super impressed, but theirs is not limited to Netswuite. Theirs works with Celiggo already. Theirs works with Aalera already. Um, so I did build a chatbot,

**Taha Raja:** that will read errors. This is 44 um that will read errors in Celiggo as soon every 15 minutes if a new one comes in. It pops it. If it's resolved, it puts a resolved bubble in there.

### **00:39:26**

**Taha Raja:** It resolves it for you. It doesn't resolve it automatically, but if you resolve it or if it auto resolves, it'll tell you it'll pop an error, but then it'll tell you it's been resolved. Nice. And then every day or when on a schedule, it gives you a digest of any open issues. Yeah, that's awesome. It's not interactive yet, but I think it can be very easily. Yeah, I mean part of in the portal like you're talking about that's part of this is a simple thing like I just did because we were talking about turning notifications on and really monitoring so 44\. It's like yeah this is even easier. Nobody has to watch their email. Now granted it's in Google chat same app and whatnot but you know everybody to me it just seemed easier than than paying attention to emails. Absolutely. Absolutely. Um, all right. So that's the big picture

**Michael Flynn:** And again, I want to open up our thoughts and minds. Like that's great example.

### **00:40:23** {#00:40:23}

**Michael Flynn:** Let's go in all those directions as far as what we want this thing to do. Let's try and center let's also try to center it on what processes do we want it to offload from us. What do we want to still do ourselves? Where does the human need to all we um and let's try

**Taha Raja:** Please be

**Michael Flynn:** to build that skeleton out.

**Taha Raja:** involved.

**Michael Flynn:** So, excuse order lunch. Yep. German's on his way.

**Taha Raja:** I just got an alert.

**Michael Flynn:** I mean, we're in

**Taha Raja:** Um so I mean I

**Michael Flynn:** Texas.

**Taha Raja:** was right before we today I I was reading S Sam Alman's podcast also that we are in singularity now the the era of long-term planning is gone. That's not uh I mean it is I mean okay we can always go back and forth but his main point was that the era of long-term planning is gone. Whatever you plan today three months down the lane it's going to be something else. But that was that's always been true.

### **00:41:32**

**Taha Raja:** He's he's stating the obvious. No but the time frame has shrunk significantly. Um right% uh it's not a linear graphic and down

**Michael Flynn:** more Steve graph. It's like up

**Taha Raja:** significantly.

**Michael Flynn:** and

**Taha Raja:** Anyways, uh so so the high level goal of of make money,

**Michael Flynn:** all these meetings or AI is eventually

**Taha Raja:** right, for the company, for us, for everyone. Yes.

**Michael Flynn:** doing

**Taha Raja:** make money from me. I don't know about you. Yeah, that's that's obvious no

**Michael Flynn:** in order to achieve that goal.

**Taha Raja:** making money, right? That that's all we trying to eventually achieve. Yeah. So, we are trying to do more with less efforts and automate more of the tasks so we can I mean, correct. Yes. So, how do I do automated and do it in half an hour and not 3 hours because I'm going to still charge three hours and do it in half an hour? There has to be some like what's the ultimate No, no.

### **00:42:32** {#00:42:32}

**Taha Raja:** See, the the ultimate goal is again you are still thinking with your current workspace. What I'm talking about is that you open up doors to other workspaces that you don't even know about by first automating and embracing this layer. See the thing is you today are trying to extrapolate your revenue based on what you know today. Right? The first step is to embrace and accept and execute. Then these other doors will open up for you. This is this is a this is very hard for a person to do especially when it comes to your livelihood and all that. Sometimes you have to say well how do I first embrace this technology and make it integral part of this now will there be a transition yes there will be a transition yeah no but that embrace must come today first because I don't know what other things will open up yet I don't even know it what kind of work will open up for you two years from now I have no idea it might not even be nuts just to reflect what Seth Alman said, how can you even predict?

### **00:43:44** {#00:43:44}

**Taha Raja:** You can't. That's what I was asking. But the thing is, the thing is, if you stay in this anxiety position thinking that, well, I'm not going to be able to charge my three hours, then you'll never proceed and I can guarantee you your job will be eliminated. Yeah.

**Michael Flynn:** So I think because the because if we go a step up the ladder, right, the it's not a matter of three hours versus a half hour. It's a matter of a half hour versus no hour because the co customers understand this. Customers are not going to pay the three hours anymore. What do customers say now? Because I've seen how going

**Taha Raja:** is I don't know maybe I'm seeing it it's reducing like can we do it remote or customers have different uh

**Michael Flynn:** onsite.

**Taha Raja:** locations. Yeah. Right. I hope that's not the

**Michael Flynn:** I I actually hope to almost reverse that a little bit and to get on-site in front of the customer a little bit more because I want to put more value on the front end of that conversation and the knowledge transfer on the people and the people you build the chemistry you get that deeper understanding and the data that you get out of that then makes the subsequent tasks.

### **00:45:02**

**Michael Flynn:** So that's my pitch. Claude today does not have the five senses that a human being does. Those five senses do not work in binary.

**Taha Raja:** They don't those five senses of you as a human being with your mind has context that then you can give to hold

**Michael Flynn:** my driver window to translate into specific work for

**Taha Raja:** on. So to Mike's point,

**Michael Flynn:** Okay.

**Taha Raja:** the on-site is going to be the most valuable thing. Yeah. And if not on site, the web conversations, how you conduct the web conversation, what kind of questions you ask, you don't just listen to the customer's request and do. Exactly. Yeah. Because that's the word that clock does that for you. Yeah. asking two, three more fleeting questions, follow-ups to say why, if or what, when, and getting that full context before you execute. Claude is the valley.

**Michael Flynn:** Yeah. I mean your question is is certainly we're all here to make money like definitely understand that business I'm seeing what like tomorrow if we simply have a model which can implement a basic netswuite with a click of a button and few inputs.

### **00:46:26** {#00:46:26}

**Michael Flynn:** Yeah. What does it mean for

**Taha Raja:** perspective like it's customers asking for it. We we are looking to do something like that.

**Michael Flynn:** business?

**Taha Raja:** I think the customers are going to expect it. Not even asking for it. They're going to expect it because you know what Netswuite's going to I know Netswu's AI is crap right now but you know the day is coming where you literally subscribe to Netswuite. Yeah. And it self-implements 80% of what you guys would have done

**Michael Flynn:** I don't know if you guys not I don't know if you guys have looked at some of the Netswuite alternatives out there.

**Taha Raja:** traditionally.

**Michael Flynn:** Taha and I have sat in on demos of a few of them who are literally implementing in hours. Yes. Like one of them. No, not ODO. I've just seen that. I know a couple. I know Dell went went away and went to them.

**Taha Raja:** Yeah. No.

**Michael Flynn:** is still kind of like us.

### **00:47:19**

**Michael Flynn:** Uh, real is one of them. Okay. Uh, dual entry is the one that heard of that one. That's a good I guess for

**Taha Raja:** Did you guys see that Anderson Frank has like one company for each and they always

**Michael Flynn:** they're they're really their name is 10th Revolution. 10th Revolution is a parent private equity company.

**Taha Raja:** company that kind of has consolidated on but each of this company serves a different ERP One is service now, one is Salesforce, one is I was like that's pretty good. Yeah. And a lot of

**Michael Flynn:** Some are named something Frank, but then they've actually expanded to the point where there's some others um dual and drive hard. Yes,

**Taha Raja:** This has become like a multi-million if not billion or something like that.

**Michael Flynn:** dual funding

**Taha Raja:** Right?

**Michael Flynn:** round that they've gone through. Uh but they've got major investors. um 19 million, but I I forget whether they put it right here on Yeah, I remember. I forget whether they're putting it here on their site, but they are they're literally saying we can get you live configured in hours and your data migrated from whatever legacy system you have in a couple of days.

### **00:48:32**

**Michael Flynn:** I don't actually doubt that at all. I think it's not it's not perfect though. This is it. It does not have the depth that Netswuite does when Taha and I looked at it. That's why we didn't. Yeah. But integrations and all mean it's basically an accounting

**Taha Raja:** As far as what like they don't really have like you're not going

**Michael Flynn:** pack be fulfilling orders out of this thing or so there's no warehouse management. There's no warehouse management. There's barely an order management but the back end is very very nice. like the accounting piece of it is very nice and very strong and their play is essentially people might want to just build their own frontends and like the thing you can't the thing that's really hard to build yourself is a top-notch worldclass accounting platform that is going to keep you on the straight and narrow. Make sure that your double entry is always correct. Make sure that you're not fussing with the numbers. As far as what your order process looks like, we just build that thing with AI and layer it on top here.

### **00:49:36**

**Michael Flynn:** A lot of the customers we have are using Shopify

**Taha Raja:** Why do you need a better order platform? Just get the get the inventory.

**Michael Flynn:** accounting information done, right? And then you can argue, well, I need to

**Taha Raja:** Well, it does that. Yeah.

**Michael Flynn:** make

**Taha Raja:** Has inventory management. Is it great? No. But do you need like do you need a I don't know about you guys at which point do

**Michael Flynn:** You really need a full

**Taha Raja:** you WMS to do what you do in the warehouse?

**Michael Flynn:** net.

**Taha Raja:** Well, and again, those platforms are changing, too. They're not sitting

**Michael Flynn:** So, so literally every time you have a renewal come up,

**Taha Raja:** still.

**Michael Flynn:** you're going to be checking what's available now. Yeah. Even as we're having all these conversations, I have a you know another question for Mike and to is do based on all how dynamic all this is and how much again if we take our technology backgrounds and the value really always presented.

### **00:50:35** {#00:50:35}

**Michael Flynn:** Do you foresee uh a point in time where our scope of work goes outside of netsw I I think if we're successful with building this tool and with what I said earlier about the technical side actually becomes less important and the knowledge business process side is what's important there's no way we can't expand and and apply this concept. I can see us using dual entry to make sure we're compliant for financial reasons and our front end is all our stuff. Y and what you said

**Taha Raja:** So all these guys are

**Michael Flynn:** Justin basically have a Shopify app that is

**Taha Raja:** doing

**Michael Flynn:** the ERP and Shopify uses all of

**Taha Raja:** so plugs

**Michael Flynn:** Shopify's tables and everything like that.

**Taha Raja:** Hey

**Michael Flynn:** It makes me very freaking nervous. Like I I I don't I don't know. Maybe I'm I still got too much netswuite glasses. But to me

**Taha Raja:** decides to change something drastically on the back end,

**Michael Flynn:** there

**Taha Raja:** you're f\*\*\*\*\*. No, no, but see if that but that's it's not if it when yeah when will this happen because it will happen.

### **00:51:49**

**Taha Raja:** Yeah, Shopify is is going in that direction as well. is eventually going to buy one of these companies and and and so Shopify is going in the direction uh they're going to get a financial package to interface dual entry probably already interfaces with Shopify. So, you know, if if you're a multi-million dollar multi-warehouse operation, you have Shopify integrated,

**Michael Flynn:** You have dual entry. It's all fully for

**Taha Raja:** then you have our cloud come in and do custom interfaces. The the beauty of that is that the modules and the customizations you've done are hyper

**Michael Flynn:** whatever

**Taha Raja:** customized to your needs. Right? Now, there are pros and cons of this. Right? The con is it's hyper customized. That means power cloud probably is the only company and your AI probably is the only company that can work on it. But the benefit of that is the cost model is smaller. the workflow is super fast because it's completely tailored to your needs. So there are, you know, there there's a lot of these things will get worked out over time, right?

### **00:52:54**

**Taha Raja:** And and the pendulum will swing back and forth until it comes to somewhere in the middle down the road. But in that during that time, we've got to swing with that pendulum if we want to remain in business. Yeah, it definitely sounds like we need to think of this as not not netswuite based and not not solely Netswuite driven. Oh, Netswuite is only a system that right already because we need the platform right now is incident.

**Michael Flynn:** It's like, yeah, this is where we've all cut our teeth. But uh but as you as you get better and better at either building interfaces to can to uh where AI basically becomes a team member and as you're you know is is part of your process and all of this aggregated data that's not just limited to Netswuite but all of its integrations and whatever you have for that particular client is um you see very rapidly how Again, if what you bring to the table is, well, I've got a database background. I've got a warehouse management background. I've got an accounting background now.

### **00:53:59** {#00:53:59}

**Michael Flynn:** You start realizing how smoothly that transitions to literally anything. Yes. You know, so I mean this is a minor example, but uh so just this past week while I was on vacation, something happened with our website. Our security certificate expired. The marketing company we're using had us like locked out of our website and we couldn't use it. And like they're like, "Oh, you got to pay us money." the whole thing was just a mess. Like shouldn't have been in that situation, but we've always used WordPress as our our website. And I was getting frustrated because I don't have any patience anymore because AI is always there to do work for me. Um, and I was just like, what would it take to recreate this website keeping in, you know, mind all SEO and make sure we don't lose any links or anything like that. And Claude came back and was like, it's like you shouldn't even use a platform anymore. You should just code this directly because your site's going to be extreme like way faster and you know it'll perform better and everything about it will be better.

### **00:55:08**

**Michael Flynn:** There is no need for a platform anymore. And I was like, wow, that's a little nerve-wracking, but I don't know, go ahead, give it a try. So, I had in, you know, basically at the end of like Monday night last week, I just said, "Go build the website for me." And it did. So, um, and then I was like, "Okay, great. What do I do with these files?" And it was like, "Oh, I don't know." Or some of them at least.

**Taha Raja:** Somebody's written their names on most of

**Michael Flynn:** I got the lemonade.

**Taha Raja:** what's matter. Oh, that's all.

**Michael Flynn:** So anyways, our website got rebuilt while my I was at my kids lacrosse practice um using no platform built from scratch and now the way in which we make changes to the website are we download the HTML and tell Claude and it's like hey I want to add another tab here. Like literally Steve was like, "I actually never liked this menu. It's always been missing stuff." I'm like, "All right." Well,

### **00:56:22**

**Michael Flynn:** I just said, "Hey, Claude, read the underlying page and add more things to this drop down." And before we were done with the conversation, it was done. But yeah, I mean, the big thing was the big thing there was no platform. That's kind of what I wanted to hit on. Like we took the platform out. You don't need WordPress. We don't need WordPress. that HTML and upload it into a server basically.

**Taha Raja:** sauce. You didn't bring any. Um we will we will see pros and cons evolve over time of you know

**Michael Flynn:** It's Maybe

**Taha Raja:** whether platforms will start appearing which makes it safer and

**Michael Flynn:** new

**Taha Raja:** easier for AIS to land on stuff like that. There will be there will be things like that that'll happen. So, you know, it it just depends, you know, but the build versus

**Michael Flynn:** is being completely flipped around right now.

**Taha Raja:** buy

**Michael Flynn:** People are now once again going back to the old way and saying, "Well, I'm much more comfortable like the maintain software is no

### **00:57:26** {#00:57:26}

**Taha Raja:** the Eat.

**Michael Flynn:** longer as scary as it once was. Maybe we don't need to be paying a monthly subscription for all this stuff." Yes,

**Taha Raja:** Sir.

**Michael Flynn:** I still think for the lifeblood of your organization,

**Taha Raja:** Oh,

**Michael Flynn:** you know, your accounting platform, you still want somebody else taking responsibility for that. I don't I don't think that's completely gone away. But

**Taha Raja:** hello.

**Michael Flynn:** yeah, it was interesting that you were thinking of Shopify in that way because we've run into these guys in a couple of deals lately. Yeah. Um their story is compelling. It's it's actually one I hate to come up against because they're like, "We started Chubbies um and implemented Netswuite and it was a nightmare. We hated it. So as soon as we sold to private equity, we started we started an ERP company, which is like kind of like what Mike was

**Taha Raja:** on exports and implemented netswu and said, "f\*\*\*

**Michael Flynn:** at.

**Taha Raja:** this. I can do it myself.

**Michael Flynn:** This doesn't we still need a finance thing for this.

### **00:58:42** {#00:58:42}

**Michael Flynn:** Yeah, I mean the Shopify connects to all the stable platforms like Quick and Enterprise Zebra.

**Taha Raja:** Oh, so I mean, you know, and for for accounting purposes, a lot of those packages, especially if you're just a pure distribution company, work fine. There's nothing wrong. You don't get anything super complicated. No.

**Michael Flynn:** So, so that's what we're trying to get out of this week. We want to come out of this week with a a vision of what AI does for our consulting practice and what it looks like and what what we would like to have. Um, I'd like to come up with a few things that we can actually use immediately. Like I think the the folder structure that I've built that runs in cloud code is actually functional and useful. It's not the end all and be all, but I think we can maybe tweak that as we play with it and test it out this week and fold the structures. Uh well, let's let's get into that if everybody's ready. Yeah. Good.

### **00:59:56** {#00:59:56}

**Michael Flynn:** So um how many people have played at all with clot code? I know you have. I know you me you and I did it together at least. Okay. So cloud code generally works out of a folder on your machine, right? I think y it has access to all the things in there. The first thing that Claude code does when it opens up is it reads the Claude MD file which in turn can reference other files and give instructions and reference skills and and some other things. So I've built this folder called assessments and proposals and this exists in Google Drive as well. You could at least from the UI you can actually if if you have the Google sync set up so that your G drive is a thing you can actually use it with cloud in the command line you can use it in the user interface whichever you like um and I'm going to start by just reading the MD file. Actually let me read it in something that presents it a little bit nicer.

### **01:01:11** {#01:01:11}

**Michael Flynn:** read in VS Code that was you sharing and I'm gonna use one of these opens it a little bit better I think. There we go. So cloud code is cloud the cloud MD file is basically the instructions. I know I talked a little bit about it in spring training. Look, here are my instructions assessment and

**Taha Raja:** This boulder produces a

**Michael Flynn:** proposal packages for consultants.

**Taha Raja:** client.

**Michael Flynn:** Basically, a little background on us. It automatically creates some subfolders. Um, a context file, a source file, which is where it will move any recordings that you have in So you're meant to first of all you're meant to work out of a subfolder that is the customers folder like the shared drive folder underneath this structure in the future.

**Taha Raja:** Yes, but they have to

**Michael Flynn:** Okay.

**Taha Raja:** be

**Michael Flynn:** Um, and it's going to move, so it's going to look at what's in there and move everything that you've prepopulated in there into a source folder, which is client provided material, recordings, transports, exports, docs, anything we get up front can go into source.

### **01:02:28**

**Michael Flynn:** Working is basically its own like note takingaking, scratch pad, and deliverables are final outputs, which we'll get to what works in there. So, first thing it's going to do is it's going to read the context if it already exists, right? So, if it's already said, this is where it's going to keep track for itself, like, have we done the discovery yet? Have we done a sales kickoff call? Like, what's already happened? Um, then it's going to inventory the folder, look at what's basically in the source, what's What do we have already? If a sales call, transcript, s or proposal exists, read it for engagement specific commitments. If MCP tools are available, confirm the connected account belongs to this client before anything else. Pull a comment ID, company name, Imran's appointment. Maybe we update this instruction and say pull number of licenses, pull some other baseline stuff. Um, check whether the power cloud script reader tool set is present in the connected accounts tool list. Um, I don't know how many people know about this or not, but I built some additional scripts and tools that can be used by MCP.

### **01:03:52** {#01:03:52}

**Michael Flynn:** um because we had we ran into where MCP can't actually open a piece of JavaScript and read it. Well, now it can. We um you shared that with me, but I I don't know that part of the long-term

**Taha Raja:** may install it or use it. So I

**Michael Flynn:** discussion is how do we make it a little bit easier to push because right now it is an SDF project

**Taha Raja:** think

**Michael Flynn:** which I don't know that I'm expecting most people to get comfortable pushing SDF projects from command line into a Netswuite account. Not yet. I love it.

**Taha Raja:** Not going to

**Michael Flynn:** that I've grown a lot of it as well,

**Taha Raja:** lie,

**Michael Flynn:** but it's a it's a big step when I can just say, "Hey, we tested this. We tested this all out. Customer signed off, deployed production." Yeah. And just walk away.

**Taha Raja:** not walk away,

**Michael Flynn:** Yeah.

**Taha Raja:** but you know what I mean. It's like, yeah, I'm not doing this other

**Michael Flynn:** It actually drives me crazy that I don't want to go down a rabbit hole.

### **01:04:47** {#01:04:47}

**Taha Raja:** way.

**Michael Flynn:** Yeah, we begged Suno for years to convert to this method of deploying Netswuite scripts and he's like, I don't really have time to figure it out. So, pre-onsite prep. So, I can now just, and this is what Imran and I did. We just said, "Hey, we're going on." It was a really simple prompt once we got his machine set up and ready to go, which actually took the most time. Um, we said, "Hey, we're we haven't gone on site yet. We're prep prep. I think we I think the the prompt we used was just like prep for on-site discovery or something like that. And then it confirms the checklists run full verification of the Netswuite information. Um if any intro discovery or kip calls transcripts exists, mine them into uh EV an evidence file. Um cross reference any transcript claims against verification results. So basically if the customer is saying hey we have five scripts running it'll go into netswuite and say well actually you have 50\. Yeah. So this is becomes a question that we have to go to the customer with during discovery which actually happened for Imran in China.

### **01:06:07**

**Michael Flynn:** Um a time boxed on-site

**Taha Raja:** from that list.

**Michael Flynn:** agenda.

**Taha Raja:** Draft

**Michael Flynn:** I'll be honest, the agenda that it produced not super indepth. I don't know that we want it to do more or not. Um, I know Imran and I talked a little bit about whether it's valuable for it to try and get deeper with that or not, or whether that's a such an easy task that we should focus our efforts elsewhere. Produce two outputs. An on-site prep markdown file, which is all of the questions with the rationale with the cross references, and then draft the agenda internal only, never to be seen by the client. Um, so basically this and I'll show you the one that came out of Shinasty in a moment here, but basically it suggests a bunch of questions that you have to make sure you are included in your discovery process. Then it produces an actual on-site agenda. Is that list of questions fairly dynamic based on the all the information it already has to this point? It is.

### **01:07:16** {#01:07:16}

**Michael Flynn:** Yes. Yeah. um transcripts uh that's verification kind of don't do that stuff that it's you're saying the reference below. Mhm. Like the next week verification I saw that above. Yeah, this is like more detail. This is more detail is gotcha. Okay. So, we can read through this but uh No, that's fine. We can do it later. And then every claim or problem that we know that exists come from the customer, we come back with, "Yep, we saw that was a problem. We agree or we agree with that point of fact. It was reported but we couldn't confirm it for whatever reason or we've heard it, you know, not from the customer."

**Taha Raja:** Um,

**Michael Flynn:** There's a list of Power Club products in here in a separate markdown file.

**Taha Raja:** there's

**Michael Flynn:** So it tries to in f in a future step where it's producing an actual rapid assessment document, it's going to automatically suggest Power Club products. So ultimately when we're done with the assessment, it's going to do a client assessment, a client proposal, and an execution plan, which is the least mature piece of this.

### **01:08:40** {#01:08:40}

**Michael Flynn:** But this is the part that we should be then taking the next step of turning the execution plan into an actual SDF project or probably multiple SDF projects which are basically just actual changes to make in next week. You would rep. Well, I know probably haven't defined it yet, but

**Taha Raja:** My assumption will be like group by task.

**Michael Flynn:** I think that makes the most sense. You know, I we need a script to do XYZ. Make that its own. So, this is the least mature piece of this. Haven't really attempted to take that last step. I hope so. I've built it like when I do it manually and it's like okay for bricks can I have this these three or four different things I've done out of a folder for the each each use case essentially maybe that's the way to think about it. Yeah. So I'm hoping that we'll do that as part of a test demo this week. Did we do this three deliverables

**Taha Raja:** was also I don't remember seeing the well cuz we did we

### **01:09:50**

**Michael Flynn:** at that stage yet? We were pre go live.

**Taha Raja:** weren't

**Michael Flynn:** Yeah. So if you come back if you if you had moved and maybe this is another good one to run this week. Shiny is complete right the the assessment calls. Assessment. Yes. Did you produce a document already? Why don't we take your recordings and we're going to run them through this and see how the output compares to what you what you did. That'll be a great one because it's so fresh in your mind. And you did it manually yourself, right? Well, I'm assuming coming up with the with the cloud. I did it with

**Taha Raja:** this document. Yeah. Right.

**Michael Flynn:** cloud.

**Taha Raja:** The prompt was combination of what we built. Yeah. The the rapid assessment template. Yep. And Claude used this NC connection because does everybody here have a cloud

**Michael Flynn:** Not yet.

**Taha Raja:** subscription

**Michael Flynn:** I have it on side, but not on the power.

### **01:10:47** {#01:10:47}

**Michael Flynn:** But you'll need it because you can't share anymore. Yeah. Yeah.

**Taha Raja:** that was why have I running out of usage?

**Michael Flynn:** Oh, wait. Never mind. Yeah. So, we're going to fix that as well. Like I said, I and I may have misthought about this. I was just hoping to see whether it makes more sense to buy overage for people or to put them in a higher seat. But to be fair, I ran out of use because I was still using quad. Oh, gotcha. Not just Oh, okay. And I I had signed out in the app, but it hadn't refreshed code. So, I was like, "What the hell?" All set. Gotcha. The dev guys are telling me they are hitting limits. So, okay. But there's like a daily limit and a weekly limit and a monthly limit. It's a lot to figure out. You can also allow overages, right? We can. We can talk about you and I. It's not a deal.

### **01:11:37** {#01:11:37}

**Michael Flynn:** we need to do something.

**Taha Raja:** So, here's the

**Michael Flynn:** So each document I won't go through point by point but

**Taha Raja:** detail.

**Michael Flynn:** there's so but it's and again some of this came from what you guys did in spring training. So there's the assessment document. Um there's a proposal deck, right? So we I loved the idea. I think we all were positive about the idea that we don't necessarily need to send a long bullet point document go through it in a meeting. A PowerPoint might be a better tool for the meeting and then we can supplement it by sending them the official graphit assessment and then the execution plan written so a future cloud code session can pick it up and execute with cloud SDF. It stays in markdown header production sandbox account ids. Um, and then branding. Before rendering any client facing docs, use the power cloud brand guidelines. Uh, here's where the actual Power Cloud PNG logo is. So, it's just got that. It can learn from templates.

### **01:12:47**

**Michael Flynn:** So, if we, you know, as we start to produce ones, it's like, "Oh, you nailed it." We can throw it in a templates folder and it will start to use that. It'll start to dial in on that exact template. Okay. And we can make this claw MD

**Taha Raja:** master across the organization.

**Michael Flynn:** publicly.

**Taha Raja:** We can

**Michael Flynn:** Yeah. I I think there's a question as to whether we should you know instead of everybody creating their own we should have

**Taha Raja:** baseline is just part of the Did you run the session?

**Michael Flynn:** certain out of the assessments folder it will just it's just going to use this so we can make updates in this one place so the key is and the way it's in my instructions document that I forget that you shared with I forget who we I think that was for Atlanta food bank it says to run it out of this G drive folder okay um checkoint So pre on-site agenda review after the evidence log and verification before drafting findings after markdown and then level of effort in commercial review.

### **01:13:55** {#01:13:55}

**Michael Flynn:** There's also a a markdown file in here where we can start to record some level of efforts for some repeatable standard things that will try to start to dial those in for you. I think that's going to take a while. I think we need to use our own intelligence to come up with level of efforts for the near future. I always love Volvah will be happy to let AI take take over for the LO. I think it's good though even if it's like as simple as you know like what's the Shopify baseline and that might be a hard one

**Taha Raja:** Just throw one out there.

**Michael Flynn:** but

**Taha Raja:** This is legal in hours level of

**Michael Flynn:** I think we have settled

**Taha Raja:** effort.

**Michael Flynn:** 65 I know because I asked

**Taha Raja:** But like somebody might not know that 65

**Michael Flynn:** you like you might not know that you might not know for digital stores the same.

**Taha Raja:** hours 20

**Michael Flynn:** Yeah, we uh That's at least Sasha's which is less than what Sun wanted to do it for.

### **01:15:02** {#01:15:02}

**Michael Flynn:** So go with that. Yeah. Uh okay. So let's start with I'm finding myself repeatedly going, "Yeah, three months ago when I had this idea, that's all s\*\*\*. Forget that." Yeah. Things I've tried a couple months back, it's like we're already past that. Yeah. But this is that's how is is that like in so that'll automatically refresh and I know maybe we get to get a future state but that MD file like T was saying like how do we all use that? Is that is that in Git where we pull it down every time or No, there's a little bit easier way to use it and let me go. Oh, you said we're going to Are we going to end up starting in the G drive now? That's correct. Okay. Because that Yeah. Assessments. So So I didn't have that. The way it's intended to use is actually that you you create a folder for your customer in here. Yep. And then so they have the product project folder and then a folder in the assessment.

### **01:16:07**

**Michael Flynn:** Yeah. Yeah. So I think our structure is going to change a little bit. We got to start in this assessments folder and we can of course rename it but then the project folders have to go underneath that. So there won't be duplicates. It'll just be in the future. There won't be duplicates. right now they're probably so um because the the rapid assessment the

**Taha Raja:** It produced it uh put it here in this folder not in the cuz yes I put it here not

**Michael Flynn:** prompt would have project the same thing with me right

**Taha Raja:** the like all my handover documents are dropped in my cloud folder and I have to move them

**Michael Flynn:** now does

**Taha Raja:** which which also Let's go

**Michael Flynn:** have customer and then even even um I guess tap

**Taha Raja:** project whatever.

**Michael Flynn:** So this is Shinasty.

**Taha Raja:** Yeah,

**Michael Flynn:** I should have put the source the transcripts and

**Taha Raja:** I put it in the other folder and give the link in my prompt code.

### **01:16:56** {#01:16:56}

**Michael Flynn:** source.

**Taha Raja:** Yeah, which you could

**Michael Flynn:** That's okay. Um, so Shinasty,

**Taha Raja:** do.

**Michael Flynn:** everybody know what Shinasty is? Um, they're a very Instagram adheavy men's, mostly men's wear, I guess. They sell a lot of boxers with like, I don't know, the crotch has a giant pickle on it or a I'm sure you've seen them if you go on it. Little bit of ridiculous like I had to ask everybody if they're okay working on this one. It's a little You just see it once and it will show on your phone every day. Yes. They're making f\*\*\*\*\*\* million dollars doing this. The hell is people like they have women's too, right? They have women clearly. No, they do. But I think I don't know. I only saw the man there. They sell out men's. Yeah. This has not been in my Instagram. See, like this. I don't know what's wrong with me. Not buying this s\*\*\* now.

### **01:17:54** {#01:17:54}

**Michael Flynn:** I don't know what's wrong with me, but this has been all over my Instagram since long before they for a customer. Well, now now it's going to be on all of ours because our phones are looking the really

**Taha Raja:** They're

**Michael Flynn:** nice fabric though. Like Yeah, like like it looks like they're the same as the MeUndies stuff,

**Taha Raja:** actually

**Michael Flynn:** which is incredible. Look at that elephant on there. Oh, yeah. Perfect for your safari stuff. I should I should give this boxer to every

**Taha Raja:** travels with me. They'll have a lot of fun.

**Michael Flynn:** Needless to say,

**Taha Raja:** So,

**Michael Flynn:** like but these guys are apparently according to Imran doing a lot of business that has Brambleberry gifts written all over all over. So I'm I'm all on that immediately.

**Taha Raja:** instance and

**Michael Flynn:** What do you mean? Similar to the you know I I think of it as similar if you're the brand I referenced earlier that sold out and started the European company Chubbies.

### **01:18:52**

**Michael Flynn:** Yeah. Has some similar stuff. Um, but these guys are killing it. So, all right. Full Bush Bush Club. All right, I'm gonna close this before I get into any sexual harassment issues here. Poor Maria didn't know what I was talking. She's like, I don't know. Everything looks fine to me. I'm like, all right.

**Taha Raja:** So we

**Michael Flynn:** a series of like intro calls, kickoff calls.

**Taha Raja:** had

**Michael Flynn:** It's just some information here. So, Imran and I fired open up Claude and Claude code. We used Claude code in the Claude app, not in the command line. Okay. Uh uh in the folder in the desk in the desktop app, we pointed it at the folder and just used the same prompts I would have used in cloud code. But I was just not in VS Code. It just wasn't in Yeah. Doesn't matter anymore. Right. Um Wait, what do you mean you we use cloud code work with

### **01:19:57** {#01:19:57}

**Taha Raja:** put include user interface. So when

**Michael Flynn:** claude?

**Taha Raja:** I

**Michael Flynn:** So I usually use a command line a black screen which we did during the spring

**Taha Raja:** code Yeah.

**Michael Flynn:** train.

**Taha Raja:** But he said he use cloud code but different user interface. Yeah. So you can plug it into VS code, you can plug it into another CLI. So after after spring training cloud Take it

**Michael Flynn:** came out with cloud coast.

**Taha Raja:** Yeah.

**Michael Flynn:** So you can now switch to code here and browse to you can see it's already in that folder. So you can run instead of having to be comfortable in a command line. You can now run, you can use the power of cloud code and the process of it I guess inside the cloud interface instead of having to use um yeah this this used to be you know kind of

**Taha Raja:** in the past,

**Michael Flynn:** limit

**Taha Raja:** but now I've not found any issues using this interface. I've gone back and forth a little

### **01:20:54**

**Michael Flynn:** I kind of still like the other way just because I've gotten used to it but I also have not hit any limitations here but use normal language right human language only you is it is like cloud code in VS using it in VS code supposed to use less no I don't think so as I swore said something about that when we were it did like but I don't think that's the case

**Taha Raja:** I think once upon a time

**Michael Flynn:** anymore I do it honestly it's comfort like you said it like it kind of brings me back to coding and I'm like oh yeah it feels a little faster I like to see the fold the folder structure and like there's all kinds of stuff I like But um same thing here. But this should be the same. It's just a different interface. So you just said all right. So let's go through it if you if we can. And if it won't screw anything up. So let's see. I think I mostly can you copy the shine speed to something else and like act like it's brand.

### **01:21:46** {#01:21:46}

**Michael Flynn:** I think we're going to try another one. So let's just go through the old one. What happened with Shinasty? Um I mean we can finish it up by preparing a rapid assessment.

**Taha Raja:** document of the or the post.

**Michael Flynn:** Yeah, I think we should on site. So, it created this evidence markdown file.

**Taha Raja:** Yeah.

**Michael Flynn:** Actually, let me get used to opening markdowns in VS Code because they look a little bit better. default maybe. So mine from five source files for four pre-sale kickoff notes plus the first actual discovery session added last see its own section treat as oh so this might have actually updated itself. Um well I don't know that would be weird. Well it has mind so it has already done. Yeah. Um, trying to see signed off. I wanted to see. Oh, actually, you know what? I wanted I wanted What did it say? Scroll up. Okay, never mind. It says shy signed off.

### **01:22:56** {#01:22:56}

**Michael Flynn:** We're in. I thought it said we we all sat like we in. do. So, this is what your on-site prep would have done like by taking anything pre-sales, right? And in fact, it did it did do it. Here's what I know. Um, build me an on-site prep. Yes. I don't like the chat. How did you just do that? Um, one of these buttons up here. Ah, that's huge. Yeah. So it actually reads the markdown formatting and displays it because it is difficult to read sometimes. Yeah. Yeah. Like I didn't even realize that all that stuff had specific meanings and it wasn't just text until like I recently. So here's the discovery prep not for client question list by process area. Order to cash gap returns are reported at 25 to 30% of the apparel business, but return authorization transaction volume is under 1% of border volume in 25 script level verification found a UEI script only creates a return author uh o credit memo when a physical item receipt exists.

### **01:24:12** {#01:24:12}

**Michael Flynn:** So a refund issued without the item shipping back would leave no netswuite trail at all. Confirm what shares are referring are refund only no return and where does that data live if not netswuite? So let me ask did this end up being a did this generate a worthwhile conversation on site. Yeah. So I or not on site I was returns and exchanges are a big topic anyways uh which was much more complicated. So they have loop they use and in their business majority of their business is undergarments. So they're not they don't want back. So so they don't usually return it but they also do some workounds of refunding. It's like the hot dog. No, they're once it's been through a couple of I thought I thought they might charge more for the I'd say resell it off to like a fetish site, but that's just but they do take some returns, but yeah, this will come up course. So I that was a this actually I when I went through it I like this first question I thought was actually the best.

### **01:25:16** {#01:25:16}

**Michael Flynn:** So basically the giving a return a refund but now we're recording it and that's yeah like this is something I would say I mean I don't think either one of us

**Taha Raja:** would have

**Michael Flynn:** to go dig in and come up with these questions.

**Taha Raja:** time

**Michael Flynn:** Our questions would be okay what is your return process? Yes. Right. walk us through it which is still relevant and that's why those questions

**Taha Raja:** feedback is to the document. We should

**Michael Flynn:** like also put that Netswuite blueprint document as a source somewhere and make a combination

**Taha Raja:** add

**Michael Flynn:** of basic questions like walk me through this process walk me already if it's a new implementation then of

**Taha Raja:** and some they're instance related it's alive and there's no I like

**Michael Flynn:** course yeah the blueprint documents note doesn't make all the same documents available anymore but I'm sure we still have one Yeah, I wish they don't do the top track document at all anymore, which I really liked. I might have it on that from that engagement session.

### **01:26:10** {#01:26:10}

**Michael Flynn:** It used to have like a literally a list of questions that you could be asking and what the follow-ups should be and stuff like that. Why do you have it in our contract? I think we might have. Yeah. Okay. So, this is was this stuff that's uh is this stuff that's a series of bullet points prior to going out on site? Okay. Yep. Oh, yeah. One one thing I think I don't know if Mike mentioned so we did build the MCP connection between Netswu and Claude before we even huge so that's how it could go in and yeah so so that's what it did is like you know these guys said they're doing crazy returns we haven't we're not seeing any returns in Netswuite what's happening um yeah somebody quoted licenses but only 160 I don't know why it says only that's more yeah I didn't I didn't ask anyway I just verified myself yeah um Yeah. One of the things that has occurred to me in this whole, you know, as in this this new kind of journey is that we I think everyone, at least I do, has this inner dialogue where you're asking yourself questions.

### **01:27:12** {#01:27:12}

**Michael Flynn:** I tend to say those out loud when I'm sitting by myself. I remember sitting at red camera next to Steve Hay and him going, "You didn't know you're talking to yourself like non-stop, right?" I was like, "Yeah, it's like I asked my self questions. What is this? Why are they doing this this way?" And um so I'm forcing myself now that instead of doing that with myself, I'm immediately then asking AI those questions. And uh so even it's like prep for this pepperman's call today, which was about their weekly price update tags that they print off. You know, I'm saying get I know we talked about this on day two in London. Give me a quick summary, a nice concise summary so I can prep for this call. gives me that I'm like dig into a little bit more into their I remember they're using a custom solution for their kits. Can you give me a summary of that? And it's like that's a great se you know of course it always you know gives you kudos whatever but it but it basically you know broke all that out as a refresher.

### **01:28:12** {#01:28:12}

**Michael Flynn:** Well I mean it would take me so much time to go in and process all that. Yeah. Yeah. And um and so now it now it's again it's the it's the never- ending aggregation of all the related data from all these different sources and then how does it apply to these and then then leveraging AI not only to get these summaries but to get the first peak at strategies things to dig into all that kind of stuff and then again vetting your own experience with you know doing price updates and item labels and all that or even suggestions really from like forums of Reddit, you know, hey, this problem I saw this problem 25 times on Reddit. This is what customers did. Yes. Yes. Um I don't have that I don't think the talk track but I thought I did. I'll dig a little bit deeper. Okay. Yeah. So, you know, so here just you know some questions here. Some of them came from human conversations.

### **01:29:10**

**Michael Flynn:** Some of them I think it's calling it a gap when it's something it sees in Netswuite doesn't align with what was said in a call. Um, procure to pay was named as a focus area in the original pitch, but the later scoping note says the core focus is order to cash, not warehouse fulfillment without mentioning PDP. Either way, is this still in scope or has it been descopeed? PO volume is comparatively low. Is this expected for the business or you know, so again, these may not be literal questions that you're asking, but these are kind of to what you said today. This is good prep for like how to dig in and what to think about and and dig deeper because like at that very first example you gave, you guys are telling me you have tons of returns but I'm not seeing evidence of Cats. tells you to look at that and there was a good answer but like you know which you know you probably would have got there anyways but like I also think there's an impressive piece to the customer when you come in and say hey we talked about this I already can see that you don't actually have that many returns what's going on I was going to say that you said you basically said

### **01:30:20** {#01:30:20}

**Taha Raja:** I won't wouldn't start out like tell me about your procure pay process. You would have got to that question or solution situation but you're going you're leading with that now. Yeah. So that you're shortening the timeline of questioning and you're you're telling them that I know what the I'm talking about because I've looked and done the research which I mean have

**Michael Flynn:** my questions. I first said the what I found.

**Taha Raja:** yeah

**Michael Flynn:** Oh, I see you have um this many returns and um this many both. So, what is your return process?

**Taha Raja:** I go back to the initial question that I

**Michael Flynn:** you know, our agent did go in your system and found some some points. So, so I don't know if you

**Taha Raja:** two separate ones.

**Michael Flynn:** need

**Taha Raja:** Maybe one can process both

**Michael Flynn:** your brand new implementation

**Taha Raja:** recovery or what do we call

**Michael Flynn:** versus

**Taha Raja:** it?

**Michael Flynn:** has a different kind slightly different approach, right? Yeah. one file can manage both or two.

### **01:31:26**

**Michael Flynn:** So it's a good question and and I honestly want to kind of punt on it a little bit here because I think the agentic engineer is going to answer that question and ultimately for us it shouldn't matter it maybe we need to tell maybe our first interaction we have to say this is an assessment of an original of an existing um customer or this is a brand new customer and a new implementation. we probably need to say that as part of I'll call it a conversation. But as far as under the hood, whether there's one MD file that runs this or whether there's five different agents, which are probably a little bit different than this, that run this. I I mean, maybe in a temporary standpoint that might be important. Um, but ultimately with what we ultimately build, it's just going to understand and pick the right tool under the hood and go do the right thing. Yeah, like you said, we don't know what the We don't know what the interface looks like yet. We don't know. You might have to set this up in the interface and maybe that's the right place to identify this is a what type is this?

### **01:32:37** {#01:32:37}

**Michael Flynn:** Maybe there's like a little wizard you run through the beginning or something. company that Mike's Mike's t-shirts existing or existing or new. Yeah. Like what's the URL so we can go read the website and some stuff like that and 100%. And you know that's yeah that's what I'm referring this aggregation of information into a single repository where how all of it's exposed and all of it's fair game for the overall context of the client and what their challenges are and what their business is and what their goals are. Now, I will say and and this is going to maybe get to get a little nerdy with it. When we look at markdown files, when Claude code first opens, it always reads your claw.md file. So one thing you don't in this case we have not built any skills or agents or anything like that. Taha's weekly um thing is a skill which is a slightly different thing but um so right now we just have an instruction set. There is a case to be made for saving tokens to keep your cloud MD file as skinny as you can and have it reference other cla MD files as needed to take action only when it needs so that every time I open up claude if I have a giant Claude MD file I'm going to burn through like half of my sess session usage just reading or half of its context.

### **01:34:18** {#01:34:18}

**Michael Flynn:** Claude can only remember so much. So if my cloud MD file gets too big because it reads it, I might use half of my context before I even start doing any work. if that file gets too big. Now, I want to push that aside because ultimately I want this to be a piece of software that we're using and that those decisions are made automatically on the fly. So whether it's one agent or two agents, let's not us worry about that at this point. And in fact, I would say nothing I've done here is truly an agent even. This is kind of a simpler setup um though pretty effectively. So your how do we discern between you know what is if we break up these different levels of regular cloud quering via MCP versus creating an actual agent and whatever's in between. Yeah. Ultimately, I guess ultimately I think we're building a to a tool. Um, and how you originally I I think this probably comes back to that idea of the wizard that when you onboard a new customer, you are hopefully guided through some sort of process that you connect the MCP, you put in the website name, you filling in the blanks, fill the checklist, you fill into some sort of blanks and it just takes it from there.

### **01:35:52**

**Michael Flynn:** I think I in a perfect world when we get there I don't want you guys too focused on the actual technology. Yeah. Um I think it's worthy of having a base understanding of how some of this stuff works of course and you may use this in other places in your life and in your places too. I was happy to talk about it but I think the output of whatever we build I don't think you'll be responsible for the infrastructure like just like given that what we see as a form just this would be a

**Taha Raja:** simple input form. There's so much code behind it, right? Mhm.

**Michael Flynn:** similar form but there's AI behind doing much

**Taha Raja:** Logical. Yes.

**Michael Flynn:** more well at the same time it's really not that much different because

**Taha Raja:** From trying

**Michael Flynn:** the back end is just not a database it's a full structure it's a full structure the and the UI that you're the wizard that you're feeding information to is just building that photo folder structure. Yeah.

### **01:36:47** {#01:36:47}

**Michael Flynn:** And I guess you could think of the cloud MD the MD files as the database for the data. How does the cloud allow you to share projects and all and make this folder structure? Is it Google Drive going to be the way we share it? I Google Drive is so ultimately it thinks uh from what I've discussed if we were to Google thought you were talking to it. Um, if we were to keep using the Google the cloud code interface, it seems like there's git would actually be a better way to go. Um, so the question to me is how how long are we using this before we graduate to some kind of tool that we've purpose built? Because I don't really want to teach everybody how to use git and do polls and all of that stuff on a regular that that's a developer's job. Um, no, but I think I think what we have to keep in mind is the

**Taha Raja:** the critical necessity of one to have a company been

**Michael Flynn:** owned database on the back end to something that's completely

### **01:37:51** {#01:37:51}

**Taha Raja:** sharable.

**Michael Flynn:** collaborative yeah so if

**Taha Raja:** Yep. Amongst team members that's going to be a

**Michael Flynn:** that does not happen properly you might have a mess like Google

**Taha Raja:** initially started.

**Michael Flynn:** Drive or we went to shared folders and all these other things.

**Taha Raja:** Yeah.

**Michael Flynn:** I agree and and I I will say my long-term vision like which may change by the end of the week with all of your input is something that looks kind of sort of like LL notebook LL like oh I see you saying you like go to the click on a tile for each customer and it has all the stuff there that

**Taha Raja:** something. Sort of kind of

**Michael Flynn:** um yeah but here's my resources here's my outputs here's my chat in between

**Taha Raja:** like

**Michael Flynn:** and but the but you Maybe even our internal chat gets moved over there and there's it's more proactive and actionable like those are. But again, um that's just my idea and just what I've been thinking about so far. Um, as of right now, if we want to get back to work on next Monday when you guys get into your office, yes, using the G, making sure you're set up with Uh, Windows Explorer or I'm sure there's a Mac version of um Google Drive.

### **01:39:05** {#01:39:05}

**Michael Flynn:** Having the Google Drive. The Google Drive needs to be in your file system and we need to be running code inside of at least as of right now is this assessments um folder and then your project creating a project subfolder under that. We might want to like maybe well I don't know what we have to think through whether we want shared folder or something like Does the actual mapping letter matter or is that It does not matter. It defaults the Google application defaults to G Drive. Yeah, I actually have two of them. Same. I have G\&H because I have my personal Google Drive attached as well. Um All right. So, you have Shinasty recordings, right? Are they in the Shinasty folder? The regular folder, right? Just copy them over, right? Yep. So, I should be able to copy my claude folders into that assessments and you have cloud folders specific to customers. Yes. I should just be able to copy. They're in the drive already.

### **01:40:08**

**Michael Flynn:** I just have to move them essentially. I think so. And the question being is do we put it in the subfolder of that customer if it's customer related? You see what I'm saying?

**Taha Raja:** Because the thing is now folder that has all the other project content,

**Michael Flynn:** We have project to that

**Taha Raja:** right? If there's claw work

**Michael Flynn:** project. Should we put it as a subfolder underneath?

**Taha Raja:** related

**Michael Flynn:** You could link it. So I think answer the question first because I think I know. Well, so I I think one important thing is to remember the structure, right? The the markdown the instructional files have to be in a general folder that is above the projectbased folder. So I think there's two ways to go about it is say everything in the project the entire project folders get moved underneath this other folder and we essentially do it like we've always done it but we've just added another folder layer on top of it or we separate the clawed work from the other work and create shortcuts and just create shortcuts.

### **01:41:12** {#01:41:12}

**Michael Flynn:** Say you can link to it. I I like the ladder I think a little bit. Maybe it makes me nervous the idea of moving everything though. I don't really have a reason it does. And the other thing I would say is what is going to be in these folders that we don't want Claude to have access to. Wouldn't we just want Claude to have access to everything? Yeah. What are the two different options? I put attachments like anytime that they email us attachments or anything like that, I'll I tend to save them. of this hit download to drive and then organize and move it into that customer's folder. Sure. And and and that's those are important files. Yeah. So why should why shouldn't why shouldn't cloud code see that? Yeah. Should see that, right? Some reference which you might not remember. I was so That's why I kind of don't see the point of having two separate folders. I I don't really either.

### **01:42:03**

**Taha Raja:** You said it before where you're just essentially putting the cloud folder above the current power

**Michael Flynn:** The way projects folder is really the why.

**Taha Raja:** cloud

**Michael Flynn:** Why not do it? You don't put any MSA

**Taha Raja:** financial documents as a power cloud over there anyways right That's all I can

**Michael Flynn:** think of. So I might do statements.

**Taha Raja:** do.

**Michael Flynn:** So statements of work will go in there. Um okay. But I'm okay with that. I mean, maybe I'll make a copy that doesn't have the dollar amounts on it or something. I I don't know. I can think about that. That's the only thing I can think about. But statement of work as far as what we've committed to the customer, I think it's important that it knows about that. Yeah. Yeah. Since since we typically adhere to it and meet the goals, well, and sometimes we don't know and maybe that's a gap that we're covering.

**Taha Raja:** But there's been times when it's

### **01:42:54** {#01:42:54}

**Michael Flynn:** I might not I don't know everything you guys talk to the customer about in your pre-sales conversations.

**Taha Raja:** like

**Michael Flynn:** I mean there's notes but I mean I don't know if that's every call or No, I think it has to be every call on our side. It has every call needs to be

**Taha Raja:** going forward.

**Michael Flynn:** recorded.

**Taha Raja:** Yes. I don't know if that's happened in the past. And I'm not saying it hasn't, by the way. I'm just saying like I don't know

**Michael Flynn:** Let's just assume it has it.

**Taha Raja:** if you had a deeper

**Michael Flynn:** Like I think that's a fair like they called you and

**Taha Raja:** conversation about on the side about a certain thing and that just happened to not get recorded. Does that matter? I don't I don't think it matters. I mean, you know, look, I mean, we try to be as as comprehensive as possible, but you've got

**Michael Flynn:** You've got to work with what you have, right? And you know, perfection can't be the hindrance of not doing anything.

### **01:43:39**

**Michael Flynn:** No. Right. You have to start somewhere and say, "Okay, well,

**Taha Raja:** We have about five calls.

**Michael Flynn:** you know,

**Taha Raja:** We have three. So let's start with that.

**Michael Flynn:** right?" And then if you you know

**Taha Raja:** The additional MCP protocol permission.

**Michael Flynn:** use to be very

**Taha Raja:** Remember the process needs in

**Michael Flynn:** closely followed in order to maximize the benefit

**Taha Raja:** the engagement of the client because you know you have the pre-sales in

**Michael Flynn:** information you get permission on their MCP and user and get access to it to

**Taha Raja:** And then you start interfacing with the client. That way you have a wealth of information,

**Michael Flynn:** stuff that you've discovered stuff that sales have discovered.

**Taha Raja:** right?

**Michael Flynn:** covered. Mhm. Stuff that has been discussed internally through the internal kickoff meeting and then you go in front of the customer. So that way you as a consultant you know when you go in front of the cons client they understand that okay there has been comprehensive turnover been done right.

### **01:44:32** {#01:44:32}

**Michael Flynn:** Yeah. These consultants don't come to the which was kind of our

**Taha Raja:** table saying, "Can you repeat everything you started with?"

**Michael Flynn:** problem when I remember when we were 100% and you know and and they don't feel like you know the company is not communicating right well even that can be perceived even as simple

**Taha Raja:** You go in and say, "Tell me about your procure to pay process." Yeah.

**Michael Flynn:** as

**Taha Raja:** Yeah. Because there's a guarantee that you've already talked about. But that's what I'm saying. They should have a clue. But that's what I'm saying.

**Michael Flynn:** Yeah. If the pre-sales already talked about it.

**Taha Raja:** Prep procure pay.

**Michael Flynn:** You might have a instead of saying tell me about this issue that you were talking about.

**Taha Raja:** Tell me about that was extreme

**Michael Flynn:** Let's dig deeper into that

**Taha Raja:** extremely beneficial at extremely. Yes. Because we knew

**Michael Flynn:** up front specifically what to ask about and why. Um

**Taha Raja:** it does two things right.

### **01:45:17** {#01:45:17}

**Michael Flynn:** well

**Taha Raja:** It builds confidence about the company and who you are.

**Michael Flynn:** from the client's perspective. Yeah. But more importantly, it short

**Taha Raja:** gets a lot of discussion that they feel exhausted talking about it because remember the client is already fed up by the time they engage with us. The last thing they're already tired

**Michael Flynn:** this issue and the last thing they want to do is talk about it three four times before somebody even starts to understand what it is.

**Taha Raja:** of

**Michael Flynn:** Yeah. It also just helps you be better prepared. What like for example when we went at RM Young in the beginning we were having difficulty getting information. Now some of that was process but if again if you have this built on is highly repeatable process. Yeah. It gives you the framework to ask the right questions to say, "We need to know all of these things before we come out of sight." Yeah. So, we didn't even know they had MRP deployed. Yeah, I remember that.

### **01:46:06**

**Michael Flynn:** Yeah. And as soon as we get out there, they began peppering me with MRP questions, and I'm have to having to very diplomatically say, "Look, it's been a while since I played with MRP. I know there's been a lot of changes, so I'm gonna have to defer until I can get back and kind of validate a lot of this data. What's changed?" Yeah. But yeah, that would have been 10 times better on site had we gone out and said, "All right, I know you've already deployed it." What you know, what are the issues you're having with it and tell me more about the detail? All right. So, we looked at the prep questions that it came up with for Shinasty. Imran has since gone on site and not on site, it was remote. He's since completed the assessment for Shinasty. I'm just curious, the prep questions, how did they come about? You ask cloud to do that based on what you're ask is uh all we do is say prepare

**Taha Raja:** So all the

### **01:46:57** {#01:46:57}

**Michael Flynn:** for on-site assessment and it automatically comes up with prep questions. Um we have MCP access. We did so we just went through it but I'll give you the probably the best example is the first question I asked which is said hey the customer said they have like 25% returns. We're not seeing more than a handful of returns in the system. There's a gap here. You need to dig into this. And it was a good answer like and I think Imran would have got there anyways, but he now came in and and was able to say, "Hey, I've already looked at this. I know what's going on. Explain to me what's happening because there's there's a disconnect here." And I'm curious when you ask them that way. What did they say? can't return the the

**Taha Raja:** fairness. I think Bron's answer is better.

**Michael Flynn:** they're missing an opportunity in the in the uh the fetish market. You're not scrapping them. Hey, you could be reselling is in Germany.

### **01:48:01** {#01:48:01}

**Michael Flynn:** Yeah, but there was also being used.

**Taha Raja:** process,

**Michael Flynn:** They have a lot of customizations. But

**Taha Raja:** but it's not coming in return.

**Michael Flynn:** yeah,

**Taha Raja:** So, they're manually booking all this. Okay. Well, they're refund only.

**Michael Flynn:** they don't want the product because the product is being thrown away.

**Taha Raja:** Yeah. They're like that hot dog's been used,

**Michael Flynn:** Yeah.

**Taha Raja:** sir.

**Michael Flynn:** That's it. Um, all right. So,

**Taha Raja:** Just

**Michael Flynn:** you've got you did your prep for prep for on site. You did that. Now, you've uploaded the Now, we've uploaded this transcript. So, rep assessment. Let's do But interesting. So, they were uh just a side question. I know they can't get the inventory back, but they're not using the return process.

**Taha Raja:** at all in Netswuite. They're booking it as a

**Michael Flynn:** do I have to go back to see in which cases they create in netswuite but

**Taha Raja:** journal.

**Michael Flynn:** uh majority they create in loop but they bring in the refund part only not the part but how do they bring the

### **01:49:06** {#01:49:06}

**Taha Raja:** Okay.

**Michael Flynn:** refund refund is there customer refund

**Taha Raja:** If it was being Yeah. inventory is not the inventory impact is not there.

**Michael Flynn:** is

**Taha Raja:** That was a question. It's just what's happening at 44 through Amazon.

**Michael Flynn:** the refund the refund gets added but the quantity is zero which is fine because it doesn't come back, but it affects their reporting and their average sales price reporting. Okay. All right. So, I'm going to give this a really simple prompt because the cloud MD file tells us what the outputs should be. So, I'm just going to say rapid assessment interviews have been completed. Please produce the handover docs for the customer. Let's see what happens. So, how does it know which files are rapid assessment? I put them in the source folder. So, it should just go to the source folder and look at them. I don't know if it's going to be successful or not. Rapid I saved my rapid assessment the title of the file or something in the folder.

### **01:49:58**

**Michael Flynn:** Right. I did not include your rapid assessment. I specifically only grabbed your transcripts and moved them into the source folder inside shinus dra. It should understand. So you have not directed per se that these are the files but it's in the folder. So it will again go through all the files. Code is very good at this including recordings.

**Taha Raja:** If you use code and you start at a specific folder, it looks at your lowest folder it's working in and then climbs

**Michael Flynn:** from there, right? So,

**Taha Raja:** up.

**Michael Flynn:** you know, it if it it uh for for context of the project folder you're working

**Taha Raja:** It always looks at the

**Michael Flynn:** in. So, if you say start reading the project context, it'll look at the folder it's working in that you've directed it to to find

**Taha Raja:** context file. And anytime you say look at the files, it will only look at that folder unless you tell it other.

**Michael Flynn:** Let's read while it's going here. This is substantial engagement with Rich Pry work.

### **01:50:54** {#01:50:54}

**Michael Flynn:** I noticed the evidence log only covers through discovery session one, but there There are three more sessions in source that haven't been mined yet. Let me check the existing draft artifacts and remaining state before planning. So, so it's basically going back and reading the new documents and take a look.

**Taha Raja:** updating itself. Yeah. So, this I gave it three new

**Michael Flynn:** We only gave one document to three.

**Taha Raja:** recordings.

**Michael Flynn:** Okay. Could be four. Maybe it was four. Yeah. Two, three, four right there. And it's Yeah, but it said it only. But is it processing uh is it processing uh transcripts from the recording to the recording themselves? I gave it the transcripts. I thought for this purpose I thought it would be faster. Um we always always have the transcript. I think I think text is probably better than um video. I do. I would think so. I mean it's gonna it have to just read the transcript, wouldn't it?

### **01:51:48** {#01:51:48}

**Michael Flynn:** Yeah. So, interestingly enough, this other company that demoed to Taha and I actually wanted audio transcript. Interesting. They didn't want the written one. I I we didn't get into why what it we weren't super impressed with what it produced, so we didn't really proceed forward with it, but I'm wondering uh if the content will be better with both. It's a good question. And it's something we can do some AB testing with. Mining digging dig digging all the data. It's reading the it mining it. It's reading again. It's ingesting it and figuring out like like what do you you mine gold? Go into a mine. Dig it out. Following the I'll mine them into evidence in parallel sub agents while I load the reference files. Uh let me launch the mining agents and read the So yeah, mining. Why did I always start it wrong?

**Taha Raja:** Mining is discovering not storing. No, no, mining is not discovering.

**Michael Flynn:** taking out.

### **01:52:48** {#01:52:48}

**Taha Raja:** Mining is extracting.

**Michael Flynn:** Digging it out.

**Taha Raja:** Extracting, not storing. There's no discovery going

**Michael Flynn:** I think so. Yeah. Yeah. When you mine gold, you dig it out of there.

**Taha Raja:** on.

**Michael Flynn:** Yeah. Mining companies aren't wasting their money. And All right. Um not finding We'll We'll keep checking in on this, making sure there's no prompts, but why don't we go backwards to um temperaments a little bit here. And I think most of us have seen this and I know there was some feedback in the moment but this is solely doing the script stuff. This is solely the scripted version. Um let's see. Let's start with the PowerPoint that it produced for temperaments and you guys have engaged even further now. So I think we can even talk a little bit more about what this was and how good it was or wasn't. I know Ron, you you thought it was fairly critical. ical. Um, I hate when it does this.

### **01:54:01**

**Michael Flynn:** Why can't I just do one page? Oh, I guess it is one page up there. So, so I wanted to dig into that a little bit, too. Um so high volume retailer with finance company bolted on seven stores two distribution centers 36 Netswuite locations 300,000 customers 90,000 items inhouse installment credit it's 50% of business one contract per order customer orders furniture 50 uh so you see like some of these it said I was able to confirm the first line or the second line in Netswuite others. Now we only had access sandbox at the time. So these are pretty straightforward statements. I anything I mean I I haven't verified the customer accounts and counts but it's probably it's roughly that. Yeah, I can tell you that. So live one year still firefighting go live June the 15th goal was stable steady state. You are stable but not steady. Budget was largely spent on the implementation. So the next dollars have to land in their biggest problems. Yes or no outside read.

### **01:55:17** {#01:55:17}

**Michael Flynn:** What is actually wrong and what to fix first? Deliverable is a prioritized road sprint document plus a one-year AI plan your own read. Set the tone for hours. So like that stuff right this this that I wouldn't put in front of a customer. This slide right here. I mean I'd probably take out the last Yeah. three bullet points. So I get that. So So this I think Claude at least was intending for presented to us. No to I don't think so to the customer there like we're saying to them, hey oh we heard from this is what we heard from you and we are setting our tone. Okay. Okay. That's fair. I can see that. And it even through throws this quote in the bottom. The customized state that we're in is probably a large source of our problems. Yeah. So, so, so, so sorry. This

**Taha Raja:** This file or presentation is an output from cloud.

### **01:56:12**

**Taha Raja:** This is an output from

**Michael Flynn:** based on this is based on their on-site recordings.

**Taha Raja:** cloud.

**Michael Flynn:** Recordings and any other substantial data they had ahead of time, but I don't think we I think it was all recordings. And you did a big was the script investigation done yet? Because that's that was a big So, we didn't have my portion that can read the scripts, but we did have MCP that could go in and count them and read the That's the one I think I did the initial. You probably did a deeper. Oh, I I didn't I just had it do whatever it says it does. Okay. So, um you know the same theme from every department. Commission calculated in Excel. Every pay period system does not match. Returns the biggest efficiency problem. 7 to 10 minutes. Promotions a year-long custom build. Now. deprecated and unused. The main bank account has not been reconciled since go live. The platform is not the end.

### **01:57:06** {#01:57:06}

**Michael Flynn:** You know, I actually have a it actually gives me I have the narrator prompts here. So, I can probably across the three days the same sentence came up in different rooms. You rebuilt stories inside Netswuite that ohus sorry that decision is the through line. Daryl's own framing was the cleanest. You did it the same way on purpose and now the same way is the cost. So actually probably should go back and read what the uh the prompts are. So thank the room one year live on Netswuite onsite 3 days across Windsor and London plus a read of the account itself. Today is what we found and what we're recommending doing about it in priority order. Um you're not a simple furniture store. You run a lender, a customer order, manufacturer's order book, a heavy promotions calendar, and two DC delivery networks all inside one Netswuite. That combination is why the platform is working hard. Everything we found traces back to this operating model. And what I thought you guys were I'm sorry, I'm not following you.

### **01:58:10**

**Michael Flynn:** This is this is another So, while the other one's running, I went back to look at what the Terman's output did. Got it. Uh you told us the platform runs the reading from that's really good though that like just that I would much rather read that. Well because it's not what's on the the slide. Yeah. Can I show So what is what what are you reading? So I have like the presenter view. Oh I don't need me right now but like use if we're if we're going to use this I you want to have the present I want to be able to read that not just oh commissions. Yeah we we noticed that it doesn't match payroll. Yeah, I'll be honest. You told us that this is a feature I've like never used in PowerPoint,

**Taha Raja:** CL

**Michael Flynn:** which is actually a really good feature. Like really, I've used it quite a bit. I just didn't know what you created. Yeah. Yeah. But the notes are also from

### **01:58:57** {#01:58:57}

**Taha Raja:** this is all from cloud what's better than what's on the

**Michael Flynn:** well the whole point is that

**Taha Raja:** presenting right so that means you know you don't you don't want to read the slide you want to present the yeah and you and you

**Michael Flynn:** you're

**Taha Raja:** also very often your slides going to be

**Michael Flynn:** very concise bullet points and then you're filling in the rich detail with your Yeah. Because you want to try to have a conversation with the client. Now one thing I will tell

**Taha Raja:** When people have these notes, when people start reading the notes, it annoys the s\*\*\* out of me. Yeah. Yeah. Yeah. Yeah. So, the thing about is you have to have the notes, but be prepared to have a conversation, not just read, because if you just read, people will not perceive the value that you bring to the table as an expert. Yeah. I would recommend

**Michael Flynn:** Yeah, memorizing the main point of the blurb and putting it in your own words is always best.

### **01:59:46** {#01:59:46}

**Michael Flynn:** And guys, I will tell you this. This when

**Taha Raja:** sits out and you just assume that Claude is giving you right and then you start presenting.

**Michael Flynn:** this

**Taha Raja:** It becomes very awkward and people will

**Michael Flynn:** catch you with your pants down When? You start saying something that

**Taha Raja:** will obviously be untrue or something. So the danger of clog is if you don't read and

**Michael Flynn:** will

**Taha Raja:** proofread, you will catch yourself. I've done it myself and I can tell you from practical experience that you should never ever do

**Michael Flynn:** and it's one of the reasons we didn't move forward with this other company offering a implementation because they showed us this stuff and it's

**Taha Raja:** that

**Michael Flynn:** like it was garbage. A thousand words that don't say anything. It was complete garbage. He presented to us files and said,

**Taha Raja:** cuz we gave him I think we gave him

**Michael Flynn:** "Can you to do this to do the same thing?" And then I looked at it and I was like,

### **02:00:37** {#02:00:37}

**Michael Flynn:** "All right, if that's what they're doing, I can do that." Which is what led me to I literally wrote this all in a day after I hung up the phone with these guys and me and T were like, "Eh, it's not really doing anything." Yeah. So, um, yeah. And he's he's captured like invest

**Taha Raja:** money on us. I was like that's garbage. What is the way they do what's their job? Supposedly they can implement another now it was garbage in the assessment piece. We never went through with them doing anything because I don't think they ever followed up with us. No. Uh and we told them saying we want to see because to be honest this part is the easy part. Yeah, that is the easy part. The odd part will be is executing on that work where the agent is doing the work for you.

**Michael Flynn:** Yes. And that's the part that we've done SDF stuff,

**Taha Raja:** Yeah.

**Michael Flynn:** but I've never just let it continue this process.

### **02:01:25** {#02:01:25}

**Michael Flynn:** Right. So, I'm going to read you exactly what it said, but this is obviously meant not to read verbatim. Yeah. It said, "This is the slide that turns a feeling into fact. 99% of custom is not normal um and is not free. The 7.4 to1 invoice ratio is your installment and per delivery billing model showing up as a real load. These came from your account, not the calls. Note verified against the sandbox refresh. We'll confirm the financial figures when production once we have access. So again, I think we learned a lesson here. The sandbox is limited in its value when we're trying to do an assessment because it was not refreshed. Well, just the numbers and the proportions, the number of sales, those aren't right. And it was actually not that old. Yeah. And it still wasn't right. I don't No, it might have been right. I just But not knowing was the problem. And honestly with Temperman's that was that was the first I've ever asked the first time I've ever had to like fight for it.

### **02:02:31** {#02:02:31}

**Michael Flynn:** Yeah. Can you give us production? What what was their challenge? They just CFO Daryl was like listen they're going to need

**Taha Raja:** Just give it to Oh,

**Michael Flynn:** it on site like yeah we're

**Taha Raja:** finally. By the time we left Well,

**Michael Flynn:** good.

**Taha Raja:** see that's that you see the difference of being on site at that point, right? I mean, if you were doing it remotely, they may have resisted completely. Yeah. So then bear.

**Michael Flynn:** You know, we can see the history in the data, right? the same job. Say Commissions distribution has an MHI version and a Netswuite version sitting next to each other. When the scripts run out of order, you get slow saves. The edit and save loop and commission records that never generate one route cause many

**Taha Raja:** or something and I'll be right

**Michael Flynn:** way.

**Taha Raja:** back.

**Michael Flynn:** And then we got a quote from Justin Lombardi at the bottom here. Yeah. Oh yeah.

### **02:03:25** {#02:03:25}

**Michael Flynn:** The great Justin Lombardi. You know why?

**Taha Raja:** So, you know what? That's probably wrong.

**Michael Flynn:** Because we're recording. Taha is saying everything we're saying today is Tahess or or or Mike could have been because because we're merged audio and this the AI the notes thinks it's you speaking. Yeah. So that's something that I did that when I recorded I recorded that happens

**Taha Raja:** Well,

**Michael Flynn:** with when you have multiple

**Taha Raja:** yeah. What happens on any

**Michael Flynn:** people one speaker as far as the recording was concern for the rap and we had the assessment we had the speaker in the room which user the speaker so it thinks everybody doesn't really think that For example, right now it thinks everything is tah. Like I recorded and transcribed all the MRP courses that I took and on every one of them it says Ron Shaw said this, Ron Shell said this. I was I wish I could have said all this. Thank you, Mr. McDonald. Yeah. So this is your number one state of priority because it touches payroll.

### **02:04:36** {#02:04:36}

**Michael Flynn:** The system of record is a spreadsheet. We verified both custom records and the open support case exists. The fix is mostly scripting, sequencing, plus a couple of structural changes, not a rebuild from zero. Uh that's actually ongoing right now. That's the first thing we tackle. Well, one of them makes sense. You said it was the number one priority. So, uh two leaks, one on returns, you can have a refund customer still has the product and the clearing account proves it never nets to zero. On cash, the primary bank account is not tied out in a year. One person wrecks it by hand, customer by customer every cycle. Both are fixable and both are quietly expensive. Uh promotions are 45% of sales and the logic underneath them does not hold. You built a custom promotions engine for a year and it sits deprecated because it does not work. This leakage is real and directional. Discounts land on the wrong lines and returns claw back more than the customer ever got.

### **02:05:41** {#02:05:41}

**Michael Flynn:** This is margin, not just annoyance. Did you present this or not? No. No, we presented them with they did he did this like kind of on the side. Yeah, this was like a par kind of like we're doing now. You've already done an assessment for Shinasty. We're going to compare them when it finishes. to present, right? Yeah. The goal would be ultimately to make this to give this more instruction so that it produces something we like even better or better or at all. And um and go ahead and hopefully be able to show this and then via email or separately deliver the more detailed document. So we're not just writing through cases 1.12 fix this level of effort two hours like that doesn't really much more useful. Yeah to be fair MLA put a PowerPoint together was very good. Yeah and and truthfully I didn't use it not on purpose just because just didn't go that way probably because it happened to be honest and I'd rather change that.

### **02:06:49** {#02:06:49}

**Michael Flynn:** So stabilize the foundation then fix the bleeders. This shape is deliberate. We do not start by patching fields. We start by making the scripts stop fighting each other because that single route causes beating commissions, performance, and promotions. Then we fix the three areas that cost you money and labor. Then we shrink the custom footprint so the next year is cheaper to run. Requested is what you raised. Identified is what we found that you did not ask about. Each with a reason. Yeah, that I mean stabilize the foundation, fix the bleeders, everything like that. Yeah, but I mean the the thing is like this is there's nothing here that's like outside of what we came up with either, which is good. I mean it show it's good on two fronts. A it means this found the right stuff and B you guys found the right stuff. And was this looking at all days? This is should be looking at all days. And this was based on a prompt or just original MD document which has there's the original MD document.

### **02:07:56** {#02:07:56}

**Michael Flynn:** Is this at the end? Yeah. Okay. So, it didn't get into any of the warehouse stuff. Uh, yeah. So, maybe I was Oh, I didn't have that one. Okay. I was gonna say I He had his He had the warehouse one separate. Ah, okay. That might be why. So, maybe that I can we can look at the folder and see what's in there and what's not. Yeah, I think so. at least although it does mention WFS. The deliverable is a road map we can fund in pieces. We label each task by how it gets done because a script fix, a data fix, and a setting change are different work and different risk. The honest answer on some items is we cannot fully classify until we production and we'll say so rather than guess. So this is just what we're going to hand them. You asked us a hamster. I was very interested in what the bullet points might be.

### **02:08:50** {#02:08:50}

**Michael Flynn:** We might. So, we should have time this week to kind of rework it here. Yeah. Yeah. We're uh not going to sell you a AI on a broken foundation. The hardest the highest value early AI is in reporting where you told us you're flying blind. But AI trained on data that does not reconcile gives you confident wrong answers. So the AI plan is real and it is year one. It just sits behind the stabilization work in the sequence. I think it's a good way of putting it. You might have said the hamster wheel com users are in a hamster wheel and just keeps on spinning. Yeah, probably wasn't. I know. I've used it more than once. Then we'd perpetually stuck in tactical mode and you can't we would rather flag these than guess the detail and the full list to live in the document. The one thing we need from you to start is production access. Once we have it, the discovery items will close quickly.

### **02:09:51** {#02:09:51}

**Michael Flynn:** I like that one because that was definitely one of the major wins that so we brought up what we need from you to start two asks from you. Confirm the priorities and get us into production from us. A costed sequenced road map with the stabilization work scoped as phase one. If you agree on the three priorities today, we leave with enough to build the plan. End of slideshow. But again, I just like like the way that that was talked through. Yeah. So, you know, I think that's important because that's again, I know Todd that he uses it. I never use those speaking tools and I think it's No, and it did a pretty good job with them. So, and I think I think it does the more we go and I thought I was against it in the in the past, but yeah, the more we talk about it, I I think it does make sense to have both documents and use the slideshow in the call, then deliver the document to them after.

### **02:10:48**

**Michael Flynn:** I think that makes sense too. And I think again going back to having th those talking points when I it's is probably even more important here because when I build my PowerPoint, I'm building it with the talking points in my mind. If I'm delivering somebody else's or something else's PowerPoint, you know, we're going to need those talking points. So, yep. So, here's the actual assessment that it came up with. and we can, you know, we'll probably have to spend some time with this and comparing it to yours. Um, so here's just a quick thought. Why don't we feed both to Claude and tell the differences or better just compare, which I actually think I did. Um, let's see. Oops. Uh, if I leave this, is it going to keep working? I think it should just leave it come back quick. Right now we have three machines. running in our two in our warehouse and one in the office to clear whatever s\*\*\* is in the air. Oh, was that it was a purifier or whatever.

### **02:12:06**

**Michael Flynn:** Yeah, we're completely dead in water, which is okay. It won't kill us. It's an option for a day or not purchase for a day, but All right. So, we're just going to start new ones. Uh, should you do it in chat or code? I'm gonna do this ask because you I feel like you have the folder structure there in code. You're gonna give it the files here. It's a good question. Um, let's try it in code. I don't know that matters. I don't know that it matters that much either, but you I was I was thinking of moving it out of code to not hoping to get like a more honest feedback between two documents without it knowing without Yeah. without going that makes sense. Yeah. To kind of remove the context of like it thinks the instructions are this explicitly. So of course it's going to write think its own document is better if I write it out of there. I agree.

### **02:13:04** {#02:13:04}

**Michael Flynn:** So let's just we can try it both ways though. So let's just go with this. And I'm just going to add the file. While you're adding that, what's the benefit to adding these chats to a project just for just for organization? I think it's just for organization and for some history. Yeah. So like I have one where I've just given it a set of instructions being like you're my financial analyst. Um here's the power cloud MCP. Everything we talk about here I want you to ground in the P\&L and the um balance sheet and think of as if you're you know a C a CFO and that's on a project. And that's on a project under and now every chat I make I don't have to repeat that command it all. So makes sense. This is something interesting. I don't think I've ever seen it. This is a coffee machine. Coffee tea machine. I put in the cup with the tea guy in it and it made iced tea.

### **02:14:10**

**Michael Flynn:** Usually it's hot beverages, right? It's pretty good. ic tea. But did you did you want iced tea? No. Is it pretty good? What did you use? The green tea. Strawberry basil tea. And it's flavored water. I get to go to the bathroom, too. What? This much. It was flavor. It's flavored water. Oh, it's ender. It's like infused water. Yeah. That's more interesting. It is. I wanted to try it. So, Justin, just really quick, which one of these um should I just use the draft one or It should be waiting assessment results PDF. Uh wait a second. Hold on. Yeah, that's the one. Is that real quick? Is is it still processing the other one? I think so. See? Where was the restroom? Um, you did right from there and then left. Reconnect how's your hot coffee?

### **02:19:40** {#02:19:40}

**Michael Flynn:** Well, he had a different issue. His his was a two-step process. It's their version of a cappuccino version of cappuccino. Yeah. So, you have two different packets. The milk froth and and it would have all fit in one cup. So, yeah. So, next time around I'll do it normal. Um, yeah. So, right now everything in our temperaments obviously is in a Google notebook, right? Yeah. Everything should be. Yeah. Yeah, I mean any of my meeting notes you get appended to that collector doc. So that should automatically get in there. You may have to go in and refresh it. I add mine in manually. So and I don't. So no. If I back out of it then Yeah. No, no. You go go into the the notebook. Uhhuh. And then click on my collector doc. Oh, gotcha. Which should be the first file in the list.

### **02:20:36** {#02:20:36}

**Michael Flynn:** And then on the top left there'll be like a it says like check for freshness. It'll say click here to refresh. All right, hold on. Yeah. So, click on my notebook. My my the top file on the left there. Top file on the left. The exclamation Peppermints. Yep. That one. Yep. Um, no, that's an actual Oh, is it not actually letting you? That's the source. Yeah, but that's what you want because you want to go you want to open the source. Oh, now see that link that that Oh, gotcha. So, usually that says check for freshness or click to refresh. It may already be fresh. Let me see. Yeah, it's already good. Yeah. Yeah. 27th. So, it's already updated it basically. Yeah. Um because if you're in there and I have it on the meeting and it appends to that file and you don't tell notebook LM to like refresh it, it may not get the latest notes.

### **02:21:41** {#02:21:41}

**Michael Flynn:** So on yours, are you uh have you automated the notes that get updated AI summary in your settings or does it just grab the uh the because they all go to a common folder, right? Yeah, it goes to your your personal meet recordings and I have a script that moves it into the customer folder and adds it to this file. Does that do that for yours or yours? Mine just mine. Just yours. Okay. Yeah, because I just manually added mine and I I printed them off to and even if we did duplicate it like who cares. All right. Comparing the documents. Now, there's value though in that and all these things kind of as we think through the mechanics of that of those just being automated. Yeah. And again to your to your point about folder structure if it's if they're all kind of obeying the the right folder structure. All right. So let's go back and look at the temperman's comparison first between its rapid assessment folder and Justin's.

### **02:22:49** {#02:22:49}

**Michael Flynn:** Now it thinks they're pretty much just different documents which is fair. Um the AI assessment is much stronger on epistemic discipline. Can't say actually know what that means. What is it? Epistemic. Yes. Wait, sorry. What did you do? So, I took Justin's rapid assessment which he built with AI but also his own his own prompting his own process changes like the one which we to probably did it. I think I think okay maybe you use the transcripts and recording and everything and then you just build another one. I just not just I did this and at the time um so the assessment which I think is the AI assessment is much stronger on epistemic discipline tier definitions up front honest labeling throughout a section that could not be verified and why and the sandbox caveat repeated where it matters. Section 34 in particular is the mark of a serious document. Naming the unknown instead of guessing is the thing that earns trust with a client who has been burned.

### **02:23:58** {#02:23:58}

**Michael Flynn:** three times. The work item document, which is I think what it's calling Justin's, is much stronger on closure, hours, phasing, stated dependencies, risks and assumptions, owners, and due dates, explicit inclusions from the total, billing terms. It reads like something that can be signed. The assessment ends on blockers in an appendix with no ask recommended starting point, which is not a place to leave a client. I think that's good. I think the answer is ultimately that we we should be merging these two things and there needs to be an instruction set which I think I have since updated the instruction set but um his document is called work item and we all just called assessment I guess well if you think about it that makes sense we had the work items table so what was his look like it was I didn't know we didn't even look at your document but we did we did I I I mean it's it's probably just too much to read through I can make them available if we want to read through them on our own.

### **02:24:58** {#02:24:58}

**Michael Flynn:** But I think me reading through a rapid assessment on the big screen here is not really what we're looking at. Tasks and recommendations. It did not create tasks and recommendations. Uh the 14 work items mapped to ODC, P2P, WMS also mirror how the client is organized and how you'd staff delivery. The assessments 82 item menu is more thorough but harder item but harder to act on and repeats itself. Um, and the R list overlaps heavily with the I list. I don't know what those mean. So, the reader meets the same problem up to three times. The requested versus identified split is good commercial instinct, but the overlap dilutes it. That's not as much as I Yep. So, there's some contradictions. These aren't super important. Uh, the work item doc says 4,500 scripts. The assessment says 2,000 scripts with 4297 deployments. I'm going to guess the assessment is right given it had MCP. Uh there are different things. The work item doc has it wrong.

### **02:26:02** {#02:26:02}

**Michael Flynn:** Uh it also asserts 50 uh address verification. The work item list Canada Post address as the current stack. The assessment says the product is address and Canada Post was raised as the preferred alternative. Don't know. Uh that's what it's it's address is the application that verifies the address. Oh, gotcha. The work item doc states that production is 24.2 is current. The assessment same well that's the same thing. It just doesn't Which one is the work item? Is that the the recent one is just or Mulas? I guess you think I mean ours. We all the work item doc lists uh PC the assessment calls and power clouds but then quotes him saying well that we know is a recording issue. Yeah. Yeah. Yeah. Physical count 35 hours versus 25 to 35\. Trivial but pick one. The work item doc has visible product de production defects implement native netswuite vendor plus matrix for existing third party prepayments is mangled track change artifact that's fine I mean we know the assessment reproduces transcription errors verbatim uh preserving verbatim is defensible but it uses I don't know two gaps in both spelling and context or something like that.

### **02:27:28** {#02:27:28}

**Michael Flynn:** It's usually where a word is spelled odd, but it fits in context. So, here's what I'm going to do. I want to go back to here and go into the assessments. That might be my local one. So, I don't want to grab that without It does look like a actually you know what I can for this purpose I can actually use my all I really want is my cloud. So the assessment So what is cloud? a set of instructions that claude code starts with like when you start a project with cloud code it says these are netswuite projects follow best practices do always put good field help in something something you have like you have to develop I have developed it with the help of claude itself I've had it write its own instructions which similar to context MD also right yes context MD basically CloudMD is universal like in the sense that everybody who uses cloud code has a cloud MD file. Oh, it applies the fold. Yep. It applies like that is how cloud code works is based off of a CL it starts with a cloud MD file.

### **02:28:58** {#02:28:58}

**Michael Flynn:** Um and if it doesn't have one, it will make one for you as part of the first steps of doing a cloud project. Context MD is something we've taught the assessment and proposals project to maintain so it understands where it is in the project from this file. How would you alter it to get something closer to the to emerged version? All right, while that's doing that, let's go see. All right, so Iran, we've got some questions. How do you want to handle the level of effort numbers before I render clientf facing finals? Calibrate the menu first. You review markup the level of effort in work items. Draft I log the figures and render the docs. Draft everything now. LOE flagged for draft. Um I think I was going to say number two. I I I was going to say number two as well. Go back to that though. Draft everything. Now LOE is just flagged as not final basically. So basically instead of just leaving it or calibrate the menu first.

### **02:30:18**

**Michael Flynn:** I don't want that. So there's there's an it'll just leave it empty. You'll edit and it'll read it. You read the first one wants us to go to an MD file and put of effort there. The second one it's going to interview us on every one and ask us. The third one it's going to interview us and ask us. So I'm just gonna for now I just wanted to write I don't care what the L. Yep. Yeah. Yeah. Yeah. I mean that would always be my preferences. It takes the first stab at it. Yeah. Scope of identified power cloud found items in the client deliverable. How complete? Include the complete 20 item menu and it tells us where we can market time RF smart cleanup email sprawl ghost transactions. Uh per cloud MD completeness lets the client see the total scope and choose what to fund. Prim to core only the requested item. I'm going to say the full menu.

### **02:31:15**

**Michael Flynn:** All right. So this is close now. So, it's going to start writing, I would think. We'll go back here while that's working and say, so I I I said the assessment was built from this. How would you alter it? Reading this changes my answer your earlier question. The spec already describes the merge document. So, I may have changed the MD file since. So, I'm not going to take any action on this. I think I changed the MD file after producing this already. I basically think I've already it format to you mean to get it formatted in the way you wanted it closer to what we do as humans or you guys do AI assisted. So what I'm going to do is I'm going to just focus on Shinasty now and we're going to go through we're basically going to do the same thing. Um let's see how good of a doc I'm going to first pull this doc up. Actually, it should do a doc and a PowerPoint.

### **02:32:14** {#02:32:14}

**Michael Flynn:** We'll let we'll have Ron look at them and see how what he thinks of it because you probably have a pretty recent memory of what you wrote. And then we'll ask Claude to compare the two and see which one's better. I mean, this literally not said a minute ago like like the stuff we did for the rap assessment template like Oh, yeah. It's not out the window, but it's significantly changing. The three months we spent, it's now older. Yeah. As template, you can comment. I mean, honestly, this is I think this is going to be somewhat the norm, you know. I mean, that get this is what I meant by three months ago. that whole thing that I just worked on. It's like that's all crap. We've moved. We're already three generations past because what AI does is it accelerates evolution and it compresses time when I did that this thing with you. I was right after that meeting I whatever we did was pretty much getting on site already.

### **02:33:17**

**Michael Flynn:** So that's why I wanted to that was the one of the big reasons I wanted to bring you guys down here and just like hash through some of this stuff because well I think it's the best the best of both worlds right there was me and Taha just building everything and saying here it is guys use this right there was the second attempt which is that of just saying you guys tell us and bring you guys in here is just like no no no let's give you some say but I'll try to work through it together. Yeah. With what we got because I I'm hoping this is the best of both worlds what we're doing this week. Yeah. I think this becomes this I think this again monthto month because this is such a dynamic period in human history. I'm not trying to be dramatic here, but it is. Is that literally three months from now, the things we didn't know that we, you know, didn't know are all going to be like, oh, well, we just opened 45 new doors and now we're like, this is antiquated and here's what we're going to do.

### **02:34:19** {#02:34:19}

**Michael Flynn:** That's that's absolutely possible. It's possible. I think my instinct's a little bit different. My instinct is that we're at a weird little point right now where this stuff is super powerful. There's become some obvious use cases such as coding. But beyond that, we're at this like pause, which may not be paused for long, where it's like, okay, we can all see this is crazy powerful. Exactly what are we going to do with it now? like how I can see how it replaces developers. I can see how it replaces entrylevel law clerks who have to write briefs and file that stuff. Yeah. But how is it replacing the rest of us exactly? And like those answers are less clear. Yeah. Well, and I think some of the I think you gave an example earlier and I would add that you know that the classic consultant who just turns things on, they're marked for extinction. I think so. And and and if we're being fair, they're probably misnamed to begin with because that is not consulting.

### **02:35:27**

**Michael Flynn:** It's not. And it's glorified. And that is not even to pick on that's not to pick on Netswuite. It's not to pick on even some of these very specialized groups who actually do some really wildly creative uh scripting and things like that, but don't have business background or operational background to kind of influence how they design things and ask the right questions. Yeah, I think we are in a great position, right? Those literally those of us in this room because we've all at different times had great ideas and said, "Hey, it would be awesome if we could take this, multiply it by that, copy it over here." And we've all written really great use cases and spec documents and that is still the job to read to write and produce to have the understanding of how the business works and what the need is to understand Netswuite to the point where you understand where the puzzle pieces are and how it could potentially fit together and then to describe that as a solution. that in the past you would have handed off to a developer to write and do, especially the lower the business background the developer has, right?

### **02:36:54**

**Michael Flynn:** If they're just if they're just an amazing coder who doesn't understand everything but will code whatever the heck you give them. We've all been in that seat and dealt with the and if you can do that now, you can just take the developer out of the picture and bring your vision to life, which is I think what has excited Todd and I so much because like we have, you know, we have our own net company that runs on Netswuite. So, we've both been able to just say screw it, let's just do these things. I what I what I just did I was showing him around earlier with uh GW Publisher. Yep. So like not even so much to get so that the project was NSAW based. Y but ultimately the deliverable wasn't really an NSAW. Yeah. But we have to use it. So I had the the goal was to get all their data from their old ERP system. Yep. The sales team had no uh customer order history visibility past outside of Netswuite.

### **02:37:56**

**Michael Flynn:** Right. Classic problem. So they don't they wanted that obviously they want to use NSAW for it. Perfect. Great. So long story short I got all the data in there. Obviously the Netswuite data comes into via pipeline and the other data was loaded one time and that's all it really needs. But to accurately query that s\*\*\* and make it like not a pain in the tail to query. Yep. You've got to kind of normalize the data between each other and get a unified view. So I had to build that all in the database. Could I have done it with my database background? Yes. Would it have taken me five times as long? More. But it was there. Now the sucky part is NSAW doesn't really render all that great. And if you're in an SAW and you need to export report, fine. It's great. It looks great. Got graphs and stuff. Fine.

### **02:38:47** {#02:38:47}

**Michael Flynn:** Now you want your users to see that in Netswuite. Doesn't work all that great. So I built a custom sweetlet that pulls all of the It doesn't even use SW to be honest. It just directly queries the database and it built the data table in a custom tab on the customer page that has all of the information they need for customer sales history grouped by year by book title. If you click on the book, it breaks it out into each individual invoice that year and gives you other data that's on the sales order related to those invoices that they need, meaning access codes and usernames, not not password safe, but you know, access codes and gives them ability to filter it like literally however they want and it's instant filtering. There's also the same portal on the main dashboard that doesn't have that's not pre-filtered to a customer. You can just dump a customer in and see it right there. But like you don't get that anywhere else unless you build the sweet lit to do it.

### **02:39:59**

**Michael Flynn:** And it's not is it complicated? Not really. But it would take a while to do it. And this was literally done I don't want to say in minutes obviously because there was some trial and it was more me going okay this gives them the base data that they want but they're also looking for the access codes how can I get that because those are on the invoice which is rolled up into the year so I need a way to break it down just the way it came out work is kind of freaking slick like I'll show it later. Yeah. I mean, we're doing so when we figure out like what our distribution is as owners, like it's been a complicated thing. Like we're saving x amount. We are looking at potential revenue or potential cash from invoices that are out based on historical pay times from different customers. It's always been somewhat manual. like TA has now built that all into this dashboard that we have and it gives us like a written verbal analysis of why it's recommending the number it is and what its justification is and what levers could tweak that if collections were faster if this was faster like that that would impact all of that.

### **02:41:20**

**Michael Flynn:** It It's great. It's made a big I mean it's made our closing our month faster. It's gives Steve and I some visibility into what was just in T's brain before. Like so yeah. I mean if you you got to wait for this, right? Yeah. Go into LastPass and pull up GW-N. I've never logged in NSAW before. So it's not NSAW. It's just it's their Nu. So you built the sweetlet outside the normal developer process just using leveraging AI and um I guess outside the normal developer process. Yeah, I didn't ask I didn't ask to do it. No, I used VS code and I'm not I'm not deployed I'm not picking on developers. Oh no, because again this is this uh this path we've had in the past. that has stood the test of time now is broken, right? Because so like for example this this uh RM Young where they had this where they had this legacy feature in their previous manufacturing system that could give them a calendarbased view on everything that was happening with supply and demand for a particular item and how the running quantities would go up or down based on when demand transactions hit and when supply transactions hit.

### **02:42:50** {#02:42:50}

**Michael Flynn:** Oh yeah. So it helped him say when do I need to kick off the next production runs and all that kind of stuff. So we we went through okay we got to reproduce it and this is conditional for them even moving forward with Netswuite and we did the normal process. We did a session with them to walk through it in detail. We created a use case. We submitted that. We got the level of effort. We got it built in sandbox. They were like yeah this does everything we talked about it doing. And then in the meantime, while they were figuring out whether they want to stay with Netswuite long term, which had really nothing to do with us, had to do with a really disintegrating relationship with Netswuite. Mhm. Um Brian, who was a production manager, just began playing with Claude and not even with MCT and started be asking questions saying, "I'm a production manager. Here's what I'm dealing with. We're in MRP." And so it's like, "Well, create this safe search." So he got this safe search.

### **02:43:44** {#02:43:44}

**Michael Flynn:** He exported that data, put it in and literally in three or four hours of a guy who was not technical at all, very strong production wise under understood manufacturing but not strong from a technology standpoint. He created the same thing in Claude, but like if it had three more months of development evolution, the back end of it and and is it something that actually pushes back into Netswuite or it just exists in Claude and run the data, pulls data as he is, he could actually click on go ahead and create these planned orders and it would pop up additional tabs that he could then hit save as long as he logged in. So it was almost like he was in MCB. So he could read and write to it and he could open up sub windows the previous thing didn't have and we didn't have. I mean he he walked me through it and I sent him the video and said go fast forward to this and it was like astonishing how good it was in the hands of someone who's not at all technical a technical person.

### **02:44:51**

**Michael Flynn:** Give us an example. You said the PSG right? Oh, no. I mean, you can type in wall in the in the customer thing. You don't have to. You can click on it if you want, but I'm just saying. So, it just tells you that a lot of this stuff that these matter which one do the school district, I guess, these very rigid things we've used in the past like save searches, like KPIs and dashboards and and and uh and reliance on a very rigid process for sweetlets and things like that. that that's marked for extension. But click on the top one. So this is all this is obviously by title, right? Yeah. So if you if you highlight a title and you just want to see like that title for history, you could highlight the title and put it in the search bar and it instantly searches. If you click on the title, it'll break down all the invoices for that year. Um obviously you can click into it.

### **02:45:45** {#02:45:45}

**Michael Flynn:** You see the access codes there. That's the important ship that they need, okay, that they couldn't get before. Not only is the sales history there now, but access to the codes are there now in the and where are the codes stored on the sales order line. Gotcha. So this is also this is going in this is looking at the at the invoice but for the sales order it goes to the related what were the codes again and related to this business. It's access codes for online resources. Okay. For schools so the school can look at whatever this book is but they need a code. Uh-huh. But then in same so the same thing exists on the customer record in a custom tab but it's already pre-filtered. You don't have to select the customer. Yeah. So if you just click on Wall Dam school on the left or any of the go Katy independent which is right down the street. I don't see any. Yeah, you do.

### **02:46:37**

**Michael Flynn:** Right in the middle customer one below halfway down. It doesn't matter. Yeah. And it's no different. Like you just scroll down and there's an order history tab only because I couldn't get it into a subtab here. It was being pain in the ass. So it's the same exact thing but just no you don't need to filter it. Yep. And what so what was it that this couldn't do? Like what what is it that a save search couldn't do? The historical data is not there. Oh, so this historical data this is pulling in this is pulling directly from the NSAW database. Gotcha. Cool. In fact, it's pulling from the ADW database. What's ADW? Data warehouse. Not even like it's not even using NSAW. It's logging directly into the database which is not that's part of NSA. Part of NSA. Okay. Got it. NSAW is like the the layer that sits on top.

### **02:47:35** {#02:47:35}

**Michael Flynn:** Got it. But see this is historical. So look at the source. Yep. because it's older. It's 2021, so the source is history. Could you have done the same thing with that data in just a custom record and did the same thing if I wanted to add 1.2 million custom records? Yes. Good call. So like this isn't out there. The fact that it look how fat if you filter like you select the ISBN. You might have to do it from one of the lines. You do that now. Punch it in the search. Like it's pretty quick. Yeah. Yeah. Yeah. It's lightning fast. And it's sitting on all that data too. You can filter sort. I know there's a there's a copy, export, print, all that s\*\*\* at the top, too. I think you can I think you can control uh control select and select multiple columns too. Yep.

### **02:48:32**

**Michael Flynn:** Yep. So, this is a this is a jQuery data tables plugin. Okay. On top of the actual script that builds the the regular table I mean that Yes. So, I mean, we have people asking, "I can't live without my historical sales orders. Like, I need to be a classic conversation that we're usually always talking them down off the ledge." NSAW, like dump them in there. And truthfully, like Ron's not wrong. Like, we could probably do that with NSAW. Sure. The live data lives here and the other data is custom. Is it Yeah. Is it going to be worse using custom records? I don't know. I guess it really depends on but I mean so there's so much you could also just do a a cheap SQL database one time you could because you want most of this as text right you don't want to have to recreate the item record you don't want to have to bring in customers who are never going to order again and that's the big thing here is if you see the views behind it.

### **02:49:33** {#02:49:33}

**Michael Flynn:** Yeah. So this is the easy part querying the the unified sales view. It's what I had to do to get there. Yeah. because I had to load all their data in in like eight different tables because the different years. Then I had to basically normalize it, merge it with live next week tables to get missing data. If it was if it didn't exist, the customer didn't exist, I had to use this, not that, vice versa. Um, but then so now you've got this normalized table and it's pretty big. So I had to do like a materialized table which doesn't you basically cache it to not select every time and then then join it to the netswuite actual data. Yep. So that it merges nicely query it one and all. Yeah. Almost every customer I've ever dealt with that was going for a pure brand new implementation initially wanted to bring their historical data. Yeah. You usually had to talk them out of it. And again, like if it was like depending on the volume, I can't imagine it would be that difficult.

### **02:50:36**

**Michael Flynn:** But the thing about this is that you're not really querying sales orders. You're not really querying invoices. You're querying a normalized table that has all of your unified sales. Yeah. So, I guess it is a single use in that respect. And there can still be issues if they have bad data normalization issues. Um, then I had to go through a lot of validation with that. Yes. Yeah, because they have existing reports and it was like, okay, well, what about this? Why isn't it matching? And we figured a lot of stuff out because they had other reports out some of their lines are kits. So, the historical data had kits. So, you have to kind of ignore those and use the components. So my claude knows that I hate the long m dash that is pretty much never been dash I was like what is m like never been used in in the history of writing until AI decided it wants to stick them everywhere for some reason.

### **02:51:30**

**Michael Flynn:** What is a m dash? It's like that double dash AI just sticks them everywhere for some reason. So I have told it that you're not allowed to use these. So it's going back and replacing them with other columns. Some of them will be colon, some of them will be other stuff. Yeah. This goes back to again the u you know every door you open there's six more doors behind it. is because there's a lot of things we either tried to sway people away from or we never even considered because the rigid nature and structure of things like save searches and and uh dashboards and KPIs were just hard limitations that unless you got into something very expensive, you were never going to be able to do, right? And now I think it's even like how do we think about there's multiple ways like if you need some report that's really difficult and I but I can do it with an MCP connection and cloud or chat GBT like exactly okay for do I need to push this back into Netswuite or can it just live here 100%.

### **02:52:46**

**Michael Flynn:** Yeah, 100%. Because it's like why do I care how many hops I've got to take on tables, you know, related to, you know, so like the one of the ones that I gave Justin a sol ways back and he and he did, but it was always a tough problem to solve was as soon as they went to advanced BOM, finding BOM revisions that had not been created based on the list of the assembly items was extremely difficult. Yeah. you know, just saying, "Hey, I just need a list of am I missing any BOM revisions." Yeah. And the hard part left for for active assemblies. Yeah. That have BOM and then there's other things and it's going to be Yes. Right. So, I think it was an FMW problem. Taha was working through uh aging, inventory aging. Yeah. Which is always been a struggle in Netswuite. Like the report's never really been good enough. the workound is not really aging. Yes. And how I got it to work, but when he tried to run it against your entire part list, it just couldn't do it.

### **02:53:53**

**Michael Flynn:** So, it ended up pushing some kind of scripting back into Netswuite. And now it is back in Netswuite. Conversely, like with the dog food people we were working on, they used FIFO and it we might have had a similar problem, but we were able to run it targeted. They couldn't understand their costing like they thought the cost was wrong and they're running FIFO. And if you look at an item master, there is no record of like how your FIFO like you might your next fulfillment might not be at average cost. It might be at some random number unless you're losing unless you're using lot control, right? which I think even then they were. But so we had it actually could produce FIFO layers and it it actually came with with a report that said right now you have 63 units in there at X dollars, 300 units behind it in at Y dollars. Yeah, because that may still be invisible. Yeah. I mean, it's always been invisible and like I don't like it was really It's got to be visible somehow, but it would take a s\*\*\* like a It would take that to It doesn't It doesn't live at that table with the with the lot and the expiration.

### **02:55:05**

**Michael Flynn:** And they're they're not using lot control, by the way. Oh, they're not. That's my It's not The warehouse tracks the lots, but they don't they don't track suite. Gotcha. Yeah. They don't po control. Yeah. Um, it's not it's not their warehouse. It's a distribution center. Another application I've had come up recently is is people who are clearly needing to compare Netswuite, either native or things like WMS to third parties and they want advice on which to use and all that. and throwing together a matrix table of oh yeah we've identified all your criteria here's here's who the players are in the market and here's here's how they answer that criteria including native Netswuite Netswuite with WMS RS smart whomever else so I'll say that's one that makes me somewhat nervous if I don't know the other platform because is it sourcing direct data is it reading being somebody else's opinion on a blog when it comes but I don't use that as a this will help you make the decision.

### **02:56:17**

**Michael Flynn:** Gotcha. I use it as a starting point for identifying who you should evaluate. Yes, that makes sense. So, same thing with Temperman's with with Demand Lab because what they're doing, what Temperman's is doing right now with a with an application that's about to expire in support is uh is much more sophisticated than anything that Netswuite has ever done in demand planning. And uh and so they they needed you need to understand though how Netswuite demand planning works so you can make the best decisions and understand if the integration from this other product is actually still using Netswuite if it's creating its own Netswuite demand plan tables to feed into your normal procurement timebased process. Mhm. So we did a one-hour session on that and then I created a matrix for them that gave them the players they had recommended and said this should give you a starting point. So I think those and and of course there's tons of integrations we've tal talked about over the years. um some of the obvious ones that maybe they don't have any competitors like advertise you know but being able to produce that kind of stuff very rapidly and easily and then you vet it with your own experience based on what what the integration is today.

### **02:57:39** {#02:57:39}

**Michael Flynn:** All right we get this thing to stop. It looks like it's it's working on look and feel right now. Um oh did did you solve the problem but we can't add connectors in our new accounts? I don't think so because I I can't I can't even create MCP connectors in my cloud pool. Yeah. So I have to just put them in globally and then you can connect it and use it. Okay. So if you give me for the at least for the Netswuite custom ones or for anything custom. Yeah. If you give me the account number, I'll just paste it in and then you can just connect it. I I don't think we're going to be able to get past that. I think that's going to be a little bit of a bottleneck, but it's If we as long as we set I mean as long as it's part of the initial setup we just want to connect when we connect the thing MCP just do sandbox. Yeah.

### **02:58:30** {#02:58:30}

**Michael Flynn:** Done. Yeah. So me or Taha you need to be an owner to add a custom MCP. Okay. So Taha or myself. It's we I I should bring it up in a second. U actually why don't I do this while it's working because I was going to give you one right now. I want to see if I can Oh yeah. Give me one right now. Actually, I'm going to go to my Yeah, I just want to go to my document so I can get the full URL, how to run the assessment process, and I suppose Um, while you're at it, might as well do \- SB1. Sure, if it's easy enough to create, too. Yeah, it's super easy. It just takes a second. So, organization settings. What I kind of want to do is is do what Taha said earlier but just feed the question from metal about concurrencies and performance and processing and say hey based on what you can tell in their transaction volume and scripting and da da da are they properly configured?

### **02:59:55** {#02:59:55}

**Michael Flynn:** So this is temperament. Yeah, just get my naming convention started with the customers. Oh yeah. Yeah. Shaw netsw peppermint. It doesn't have to be like peppermint either. Production remote server URL paste. Oops, I missed it. Oh, skill is saved. Yes, I did that. Oh, that's good. The transcript. All right. So, how to run? Where is my URL? Here it is. Copy Claude. Paste. All right. What is the account number? I pasted it to you. Oh, you did. Okay. I don't know. I should tell you. 845\. 845\. 3683\. 3683\. Uh, let's see. Okay. So, his his skill uses the his skill uses the uh a query to get the hours. I'm assuming that needs the MCP connection to the power cloud, which seems to be there, but I don't I don't know if we're going to be able to connect.

### **03:01:41** {#03:01:41}

**Michael Flynn:** I'm not really sure. I haven't He mentioned he mentioned going and using the project dashboard and just downloading the hours. Oh, gotcha. For now. Okay. just feeding it in which will work if we had because if we don't have the MCP connection to power cloud gotcha then it won't then the query won't work the executive summary query and you said it's it's \- SB1 you said right yeah all right those should both be in there I've noticed sometimes it takes a minute I don't see I don't see them but I'll check in with Yeah, if you go on the web, you should see it almost instantly, but sometimes customer has to approve or something. As long as you have the admin access, we can establish the connection, right? We can establish it. We should get customer permission. Right. Right. Right. It's not like going to them to approve something. I think also wants to do it and I I just did a refresh in the in the app and it worked.

### **03:02:49** {#03:02:49}

**Michael Flynn:** code. Oh, I see. That was weird. So the call we did with temperament didn't create a I'm not seeing a sharable transcription. I won't be able to connect this proud right now. So just Justin Justin take a look at the calendar event for this morning for the price tag printing. See if you see an actual you know the normal AI summary and transcription notes. Okay. All I see is a internal or a file from somebody else that was, you know, taking notes. I don't see the normal. All right. I'll take All right. Oh, wait a second. All right, we are done. first. So, let's let's walk through this and we're gonna let Imran mostly chime in when something is good, bad, or indifferent or you can hold his criticism for the end. We'll start with the PD. You obviously didn't do a PowerPoint. I don't think you did a PowerPoint. I'm going to start with that and then we'll look at the assessment itself.

### **03:04:07** {#03:04:07}

**Michael Flynn:** So, this PowerPoint is presentation of the assessment summariz essentially. Yes. All right. So, interestingly, it didn't give me notes on this one for better or worse. So, we're just going to look at the slides. Oh, interesting. Who shines these brand Internet First Apparel, founded in 14 in Boulder, humor forward underwear, swimwear, and casual apparel, plus a matching underwear subscription. 90% ecom, Amazon, wholesale. That's right. Uh, owned retail and airport kiosks. Huh? I haven't seen an airport kiosk yet. Oh, yeah. That would be interesting. Fulfillment self-fulfilled from a Denver DC on a custom Netswuite based W and a custom shipping rate service. This build is why they stay on Netswuite. Yes, they have customuilt warehousing and shipping software and they like it. It works well. They control 100% right. So that's the point they like about single netswuite company. No one basically a cell phone 3BL basically or no I mean 3 yeah it's their own distribution center they fulfill it themselves just but I mean they're using some other software for the fulfillment side or they yeah no same software scans and everything.

### **03:05:26** {#03:05:26}

**Michael Flynn:** Okay. So single netswuite company, no one world accounting team in Argentina. Assume that's all right. That seems be pretty crazy to get that wrong. What we've heard closes slow month end runs 8 to 10 days. That actually doesn't sound that slow to me. And manual reclasses and matching drive most of it. Reconciliation never rests. Amazon Amazon settlements need a manual fix almost every month. Exchanges are the hard to tie the processor. I don't want to stop, but I have a question about the Amazon settlements. The warehouse fights warehouse fights the system. Overselling at peak wholesale allocation and commitment loss. Manual reconciliation twice a month. Reallocation. Reallocation. Sorry. Which one's worse? I mean, that sentence sounded like barbell to me a little. Yeah. Uh, performance is bought, not tuned. Concurrency licenses added over time. The monitoring tool that would find the real bottlenecks was never turned on. Every fix left a layer.

### **03:06:30** {#03:06:30}

**Michael Flynn:** Custom scripts and integration kept the business moving forward and accumulated into a hard to change complexity. What we verified in the account returns aren't missing. Return authorizations are 7% of orders because returns record through loop and Amazon not netswuite. The 25 to 30% is real just recorded elsewhere. RF Smart is dormant. A full RF Smart install sits inactive alongside the live custom warehouse system. Cleanup and a license question. A live integration nobody mentioned. Market time is deployed and running for wholesale never came up afterwards. They didn't bring it up. I didn't What is market time? Ultimately, we don't know. It just never came up. I mean 90% is e-commerce. Out of the 90% majority is Shopify. 10% is others and within that new order and SPS is the bigger. So this we talking still something just passed but so customer records at 1.84 million one per Shopify order. Yeah because they're creating customer. Yeah. So I mean this is our you usually suggest going this route because there are some complications but this might be an instance where truly might not want to do this.

### **03:07:48** {#03:07:48}

**Michael Flynn:** Well, but why wouldn't why would it be one to one? If I reorder, it should be the same. I think they're saying it probably doesn't reorder very often. One to one means like uh yeah, if you reorder, it's going to be same customer, but Okay, that's fair. But when you're that successful, I guess you end up with almost two million customers. Why do we recommend this? I thought we recommend one customer per or consolidate into one record like Shopify.com. We we usually don't and the and one of the major reasons is also a just a different reporting or screen rendering were you to ever open that customer and look at the order list it would like explode. Yeah. So, not to mention, although it's gonna be pagenated, so it probably wouldn't really be loading sublist. There's there's ways to there's ways to solve that and we can talk about at some point what the right answer for these guys is but loading this page is also like just click on customers relationship customers takes whatever to I mean I don't want to go solving this right now but like just I can't help myself from thinking like is there a way to that like once something's like two years Don't.

### **03:08:58** {#03:08:58}

**Michael Flynn:** or something. We do like uh set the email with something generic and merge the customers into one record or something. Yeah, God knows what a one million customer merge would look like. Probably break Oracle. But what if you just deactivate them and then it doesn't try to load them every time. There you go. Maybe it's just as simple as that. A customer with no activity in certain time. But payments in banking are heavy. a 29 script EPA suite, an 18 script fistpan layer, and the Nimbus portal all active. I know what Nimbus is the software they use for processing payments. I don't know what EPS is. Okay. Oh, EPS is Yeah, they said it's a Nimbus' product or Nimbus' old name or something. Gotcha. So, it's somewhat related. The script might see the old name, but we got a quote. Okay, good. Almost every month we have an issue with the settlement. A small difference below 10,000 approximately every month.

### **03:10:03** {#03:10:03}

**Michael Flynn:** This is manageable, but we always need to check it every month. Shinus the accounting. What's the issue? So, uh they have two, right? They have Amazon and Shopify. They don't have a payout flow. Okay. My question is so we have manually bring in CSV from Shopify. Um I think Amazon they get something through the integration but the bigger issue I think on the Shopify side is which I don't know I wanted to ask the hard this is possible. So they bring in a sales order no customer deposit then they fulfill it. So there's item fulfillment then the invoice runs and then it converts into cash sale. Because yeah, because they pay the they just they take the payment. So if you specify a payment method on payment up front, they don't. So they're set up they're set up as if they don't, right? So if you bring a sales order in with a payment method specified on the sales order, it's always going to turn into a cash sale.

### **03:11:10**

**Michael Flynn:** If I always say you should match the real world. So, if you collect payment upon fulfillment, which from a Revrec standpoint is is actually what's recommended by your credit card companies, nobody does it. Um, but they recommend that you do not charge a credit card until you fulfill it. So, traditionally, what you would do is you would take the sales order in, no deposit, payment method recorded. Upon fulfillment, you fulfill and cash sale it. Then that that makes sense. But they they take it. Yeah. So then so now you're going to have a cash So now you're gonna have a cash mismatch, right? Your revenue will be correct, but your cash won't be. She got on. funds, but well, it won't go to undeposited funds until you generate the cash sale. I get why why are we not bringing the deposit in is my point. You should be in my opinion. If you take the money up front, why you should match what's happening in the real world and in between there like Shopify?

### **03:12:17**

**Michael Flynn:** Yes. Yeah. And they haven't even recorded a payment yet or deposit. Yes. So, that's a problem and it makes wreck really hard. Yeah. So this is relatively small think about it. But yeah, that's that's what I figured. It doesn't make sense, but I wasn't sure. My question was probably more simple because 44 has an issue where the settlement the the the the different transaction and non-transaction amounts are not landing in the proper account. And I think that's because they're just not mapped. But it doesn't but the mapping that they need doesn't come in in the drop list. So I don't like I don't know if we can just type it in. I'm not sure how to do that. Yeah, like I we were just trying it like it's cost of advertising. Yeah. And it's landing in monthly dues section or whatever. Whatever. But I've never actually I've never used the standard. It's the Amazon settlements, but it's it has drop list of like you can map these fees elsewhere, but the the the cost of advertising isn't in that list.

### **03:13:16** {#03:13:16}

**Michael Flynn:** So, I don't know. Can I just type it in and it'll work or what? Anyway, so we get for some reason we got another quote. It's taking like four minutes in some cases when it usually should take 15 seconds. The problem is the large volume of invoices that we have in Netswuite that's on the wholesale payment portal which we don't is a third party product, right? So 10 people placed an order at the same time, we will oversell because of the sync. So they sync their inventory until the decision is every 15 minutes. So now it could potentially it could make it worse. Right. H So they have Amazon and they have I'm referring to Shopify. I don't know Amazon. Um I don't think you'll see the inventory Amazon, right? Well, it depends. Are you doing FBA? FBA you would not. No FBM. So So here's the problem. Like if you why do you need to I mean again I don't mean to be solutioning here.

### **03:14:21** {#03:14:21}

**Michael Flynn:** It's not what we're trying to do. But big picture if you're only selling on Shopify if Shopify is the only thing pulling from that the pool of inventory in question. Better way to say it shouldn't need to sync more than once a day because as Shopify comes down Netswuite should come down. The only thing you're going to miss is new receipts. they'll just be available for sale the next day. If you can live with that, you really only need to sync once a day. And in fact, syncing more often, depending on how long the sync takes to run, you create this period in the middle where the two things could be out of date because really Shopify is going to know about the sale before Netswuite. If it takes two minutes for the sale to drop into Netswuite, Netswuite is going to be higher than Shopify. And if the sync happens in that two minutes, it's going to push Shopify back up when really the problem was Netswuite hadn't seen the fulfillment yet. Well, the order Shopify is going to decrement its own inventory.

### **03:15:28**

**Michael Flynn:** Shopify should be decrementing the order, not the fulfillment. That's important. Yeah, it is. Yeah, it is. So, so it's read it should be reading the available number. I'm sure it probably is. And as soon as Netswuite gets the order, the available number drops, but there is a gap there. So, if Shinasty So, if if Shopify drops, say 10 to nine, 10 to nine, and then we have a two even a two-minute delay. If the inventory sync runs in between that, it's gonna say, "Oh, no, no. Netswuite says we have 10\. Push back to 10, then the then the item falls in and Netswuite falls to nine." Now you're out of now you're going to oversell. But that's the case where you're saying if you're sinking too often, you run. Is it easy as do they have out of stock selling them? They meaning if I have 10, do they allow back or Yeah. All right, let's bring this in. We can certainly talk about this, but let's try to work.

### **03:16:22** {#03:16:22}

**Michael Flynn:** So this was all remote. Uh yeah. Yeah. I have some feedback on the remote rapid assessment also. If you can talk later on as a company wise it takes longer. It's still not the same as on-site. Agreed. I don't not call it rapid assessment. You should go with that fast discovery terminology. That's still you know some that was fast discovery. Yeah. Being onsite has few things tangible things which you cannot feel. Absolutely. Um because the moment you get into the third question like maybe I'm spending too much time. Let's move on. We just have like 30 minutes left. We just have like an hour left. Yeah, I think that's 100% fair. Now, we're not really ever going to say no. We're not going to take the gig because you guys don't want to do on site. So, uh so what the status quo cost? 8 to 10 days to close every month.

### **03:17:12** {#03:17:12}

**Michael Flynn:** Amazon settlement needs a monthly fix. Four minutes per payment, two times a month wholesale weeks to run a customer update against one point. Jesus, what kind of updates are they running that have to hit a C? Never mind. I'm now I'm leading us back into solution customer update against which it would. I mean, trying to run a CSV update against that many customers would be crazy. My question is why the hell do you need to run an update against the customer record at at mass when they're generic ecom customers? Six to eight scripts overlapping notification logic hour an hour to trace one change. What we propose order to cash fix wholesale allocation and commitment loss. Reduce overselling. Replace the discount hack. back with power discount hard and wholesale payments procure to pay repair the purchase clearing matching adopt native vendor prepayments rebuild the fragile bill import warehouse baseline performance with APM then optimize retire the dormant or smart install record a report automate the the channel segmentation at order entry stabil stabilize Amazon uh platform consolidate 1.84 24 million customer records.

### **03:18:28** {#03:18:28}

**Michael Flynn:** Clean up dead code and gateways. Consolidate notification scripts. Phase one foundation immediately. Phase two near-term. Phase three planned. Put some things in there. Headline effort. And this is of course estimated. You have one bucket for the entire project. Yeah. Because I think it just I'm sure the other document has it broken down, but we're just trying to I gave it a template, right? Yeah. So we can't really uh we're not trying to show every task on the PowerPoint. It should be on the template the other doc. You mean uh several foundation items are discovery le excludes per unit work customer record migration third party license add 15% for pro that may or may not I would not put that in there. I would just build that in build time and materials work can be funded individually. recommended starting package, APM performance baseline, purchase clearing, repair, financial segmentation, Amazon settlement, wholesale allocation, preliminary 24 to 40 hours. Again, these are meant to be changed.

### **03:19:38**

**Michael Flynn:** The hours um it knows it's not good enough to get those how the engagement works. TNM discovery led where it should be. Foundation items start with a short scope discovery that produces confirmed build estimate before any build. Weekly working sessions, discovery is done. We shift to weekly cadence to align priorities and execute without the whole team on every call. You stay in Netswuite. Nothing here requires a platform change. The custom build stays. We make it cheaper and safer to change. One decision to start approve phase one and grant power cloud production access. Um so before we look at the apples to apples comparison with the other document feelings thoughts on this as a power as something you could lead a call with. Yeah first of all it's not apple comparison. This is a powerpoint that's a world no no before we do the word dock to word dock before we do that. Um yeah so so even my first draft of the rapid assessment document two very key points which I don't know why because it's in the transcript one was this uh payout reconciliation y because they don't have a payout flow connected with the First, order flow process that they don't have a deposit they do the caps like to re uh to you know review it further and come up with this is the right model these are the two main points actually I don't know why

### **03:21:10** {#03:21:10}

**Michael Flynn:** my first attempt and this also both of them okay so I I have an idea why but let's just let me come back to that after I want to hear your full thoughts two into this and take out some fluff in there too yep yeah I because idea of powerpoint is to make concise, right? These are too many slides. Okay. So, it kind of So, you think it's a little too many. Um the the multiple pages of quotes probably would be too much. Okay. Um let me pull up the actual assessment doc that it built and we can look at what you think. I'll ask AI to do it as well, but I want to just quickly take an eyeball on it and see what you think. you. This should be the one that we This is the one that Claude built just based on your calls. So, let me answer one question before we do that. You You talked about like why it didn't call out the customer deposit versus cash sale thing.

### **03:22:14**

**Michael Flynn:** I think that's domain knowledge that we have not trained Claude on. Like I don't think Claude knows without us telling it to go research methods to do that that so unless you had said somewhere explicitly we talked about in the so in your transcripts it's in there okay let's review this process you know we might have a better way to do it deposit and all that stuff there was like a 20inut conversation okay then it's a good question I I I'll dig into that when it missed it uh and again I may have missed context here since I'm jumping in did help log to reexamine. Yeah. But so I just we just went through the PowerPoint that we had only done the pre-sales thing for Shinasty. I just gave it his transcripts and said go. Um and we just went through the PowerPoint. We're about to go through the rapid and it did not really pick up on that. Got it. So, but everything else came out okay or there was a there was some good stuff in there.

### **03:23:19** {#03:23:19}

**Michael Flynn:** Um, I think it was very fluffy like a lot of quotes from the customer being reiterated back to it which was what we saw when the other guys hit. It was Y. So, we need to fix that in our process. Yeah. I kind of like them on the bottom of a page but not its own page. But here's the thing, you know, I I like quotes like that if you're trying to sell something. I'm wondering from a consulting standpoint, does it even make sense? So, I guess that that's fair and I think if it relates and gives them context to what the rest of the slide shows, then okay. Like we derived we derived this information from these this type of quote from Daryl CFO from Adam in the pre-sales. You know what I mean? Like things like that. But I get I know what you're saying. Yeah. It's like would would the would the content be better if uh if we told Claude to, hey, we did the rapid assessment.

### **03:24:18**

**Michael Flynn:** Here's the transcript. I'm going to give you access to the transcript and I'm going to have you examine through MCP in the context of the transcript to do a better job in coming up with these things. I think it does do that. I mean, we saw Yeah, we saw places where it confirmed things or disagreed with things. But I wonder if you gave it some explicit thing saying do some deeper investigation in these topics. Yeah, let's we can go back and look at it and because we only we've just let it go and then looked at it. Yeah. Like we reviewed this but looks like you missed X topic. No, but even in the initial prompt you say that look as you read through the transcript, right? Research the problem. Research the problem in Netswuite using the MCP connector to confirm to add to it to formulate better solutions potentially. Yeah. And and potentially use docs.oracle.com to look at at I think we need to approve official documentation. what what would we what we what would we do as individual same thing and and that's just that's really an evolution of the clawd right it is or or giving it yes basically I don't want but I I I think doing the prompt you have to if you give it explicit

### **03:25:35** {#03:25:35}

**Michael Flynn:** instructions in the prompt you know that I think it would be good yeah I think we can do that I'd like to put it in both places because I I want to make it I want to make it more consistent regardless of exactly what you prompted to do, right? I want us to have a style and a brand. So even in prompts, can we create a template of prompts saying you must do this, this, this, this, this. Yeah. So maybe that's what it maybe it needs to guide us through it a little bit more and interview more back. Um, which it did do. It asks us some questions at the end about level of efforts and stuff like that. Um because one thing I've I've learned over time is that short questions 90% of the time I get things in there that are just garbage. But if I write a long document prompt with all the details that I wanted to cover, I've seen superb results. What is the difference in usage based on that?

### **03:26:41** {#03:26:41}

**Michael Flynn:** No, I mean I I honestly I haven't measured for me. For me, here's the thing, right? Usage does not matter if I'm getting garbage. Yeah. No, right. And again, I think I asked this I might have asked it earlier, too. I feel like I heard Reesh make comments about like hey if you you know about if you just just give it basic come I just want you to do this I just want you to don't go into detail of why and all that stuff I would uh and I'm not saying that that's right no but in that situation it's like okay think of it from a human person right what happens when you don't guide it you leave it to their yeah you make it makes perfect sense yeah so I think I think that's what's happening well there can be a difference too and the approach based on what he's producing versus what we're producing. That's probably true. Honestly, that's probably true. But even even coding, I'll tell you, you know, um I'm the kind of person who will look at the code sometimes, right?

### **03:27:44**

**Michael Flynn:** And I will tell you sometimes the coding is like, what? Why did you even do that? It's like I'm catching my ear this way. It's still catching your ear, but why do it this way when you can do it this way? Yeah. and why did you do it that way? Right? And sometimes it'll say, "Oh, yeah, you're right. This is a better process." It's like, "Okay, well, you didn't think about that." Well, because it doesn't it doesn't care. Well, it was right. It's just not the most efficient, right? Or best, right? But see, then if I give code instructions saying like one time I I gave it a instruction saying, I want you to write this code that takes up this much memory only. Oh. And then it wrote tight code that did it. They probably minifies it too. Exactly. Because you know that was one of the tasks I had to do at NASA because we were dealing with only 64\. So I was like the code I said because it runs faster.

### **03:28:40** {#03:28:40}

**Michael Flynn:** Yeah. It executes faster. It executes more efficiently. Uses less energy. So I mean all these things matter today. We don't care about it because we're so gleeing about the fact that it can even do this that you don't care about efficiency. But I can tell you those days are coming because I can tell you the cost of running these AI is about to skyrocket up. So putting very specific prompts and putting the energy into putting your non-binary intelligence into a prompt that directs the person is going to be very important. And T clarify when you're talking non-binary from your from your perspective, we're talking getting away from true false. Yes. Because the computer this is a computer. Yeah. It still operates on binary. I don't care what people say. Like you said, is it right? Yes. Yeah. Is it efficient? No. Yeah. Like, yeah. I could drive to your house, but if I drive to Massachusetts first Yeah.

### **03:29:35** {#03:29:35}

**Michael Flynn:** Yeah. And the thing is the thing is, you know, this is where I think, you know, I'm the more I work with it, I seen I'm I'm seeing clarity on where the human intelligence will play a role until, you know, true AI and artificial intelligence comes, which is this is not. So Mike going back to the so one is creating better prompts on the front end to get better results Is there is there such a thing as um building in where it's then asking you questions to validate and verify? There is. Yeah. So, because I've noticed too, like on mine and and Todd brought this up, every time it produces something, even if it produces three pages, I carefully read through all of that. And though it'll already have three things teed up, do you want me to do this? You want me to do this? You want me to do this? I'll be like, let's hold off on that stuff. It always wants to do more. Here's my list of some other things that I want you to clarify or truncate or be more concise or add based on the initial.

### **03:30:36**

**Michael Flynn:** I don't do any coding anymore without it doing planning, asking questions and doing testing against its own assumptions with me putting prompts in. Because I'm telling you, one of the the Simpson project that I'm doing, it's producing so much garbage on the back end. I was like, this is all b\*\*\*\*\*\*\*. you know, and the thing is it's it's it's not right. It's you think for for long term it's not sustainable. All right, let's do the comparison. So now we've got the rapid assessment document as Claude wrote it. We're going to bring him through it, see what it looks like compared to his. So this is it. This is it. And then I'm going to feed them both back to Claude and say, "Hey, compare these two documents to each other." Yeah. Um good point. So you use claw as well, but more probably more directed like not just I just said go. Yeah, his this document is coming from that original from one sentence. Yep. The only thing I did is I stopped it and said we don't have time to worry about finding the fonts so just leave it.

### **03:31:43** {#03:31:43}

**Michael Flynn:** Mine was generated referring to transcripts from all the other database but my prompt was yeah two or three lines and you probably had some background. No, sorry. My prompt was the one which you built for the you know the item you all which is also pretty detailed but okay then yours do you have by any chance if you go back to your cloud can you retrieve your pro or do you guys have it documented as part to retrieve your prompt they documented as part of the process they were doing so we have it yeah so you can open it I mean I I just I just took out the one part from it well let's see how this came out yeah so we've got a pretty big summary here but I'm going to read the whole summary and And I'm going to pick and choose some parts. All right. So, Shinasty one runs one of the more heavily engineered Netswuite accounts in the direct to consumer apparel space. Over eight years on the platform, a lean team has built a custom warehouse system, a custom shipping rate service, custom Celiggo integrations to Shopify and Amazon, wholesale automation, and an EDI compliance layer.

### **03:32:44**

**Michael Flynn:** All on top of a single company Netswuite instance, moving 2500 to 3,000 orders on a normal day. and 5,000 to 7,000 at peak. Correct. The system works. It also carries the weight of every quick fix it kept work that kept it working. And that weight now shows up as an 8 to 10 day monthly close. And I'd argue that's not bad. A recurring Amazon settlement wreck that has needed manual correction every month for two years. A warehouse and wholesale flows that require regular hands-on intervention. None of this is a story about a broken implementation. is a story about scale outpacing an architecture that was designed for a smaller e-commerceonly business. The findings below separate what we have verified directly in the account from what the team reported and they map each painoint to a specific fundable piece of work. We found nothing that requires leaving Netswuite. We found a clear set of foundation items that done first make everything after them cheaper and safer to change. I have a question.

### **03:33:50** {#03:33:50}

**Michael Flynn:** What do you think about the tone of that paragraph? The paragraph that was just read. How how would you if you were the customer the whole section if PowerCloud delivered this with this tone? Yeah. I mean, look, it's not human written. Okay. Not human written, but to me it just sounds like a a novel I'm reading. And is this a professional document that delivers an assessment or is this a novel? That's just me. But so it's definitely very verbose. Yes, I don't mind a verbose paragraph up top. I do think this goes a little too far. But I do think a textbased verbose intro is nice. Like the sentence, none of this is a story about a Yeah, this wording word story, you know, it's almost like as if it's trying to be jovial about it, you know? It's like uh to me an assessment delivered by professionals should be very factual. Yeah. And how about this last section here? Was leaving Netswuite something that was ever on the table or discussed?

### **03:34:52**

**Michael Flynn:** Was this because I had a question to you. Was this on the because it was on the PowerPoint too. It was does the the context entry document somewhere? It does not. So that was never discussed or something. No, no. I'm saying no. But I think his question is was leaving next week. Oh, I'm sorry. So you So maybe it was in a kick. I'll ask it where it came up with that. Like maybe on the very first call with Steve. Don't you think that if they were planning to leave that would have been brought up with your rapid assessment? Not during rapid assessment. Could be on Steve's first call or something. No, I'm saying I'm saying think about it. If she was thinking about it, they would have brought it up. Yeah, that's not so I I remember the rapid assessment leaving was not brought up. Okay. I remember during the kickoff there was a comment that you know they have built in warehousing system custom that's why they cannot move off of no I would I would not ask it that way I would ask it saying where did you find this information okay period what's your source you know yeah because you definitely don't want to bring that one up if it wasn't on the table.

### **03:36:02** {#03:36:02}

**Michael Flynn:** This definitely wasn't as explicit as it should be. At this point, there's no reason. Maybe in one sentence or Oh, another fire. They're following. Oh, I mean, they were those guys were just all in the lobby here. Old truck. I think we're burning down. We're looking for people companies in Australia. Oh, really? I have to reach out to the vehicle. Feels like 108 outside. Oh, it's 99 according to my car. Is it humid? It's human. All right. The framing traces to the pre-sale interview notes, not the four discovery session. It comes from a pre-sale interviews copy of Shinus interview meeting notes, not from the four sessions. Um the custom MWMS and custom shipping platform built natively in Netswuite were stated as the main reason they won't leave Netswuite. Then line 25 Matt is approaching a Netswuite renewal negotiation. Renewal is highly likely due to switching costs but wants to optimize before committing to form. It's a stretch.

### **03:37:11**

**Michael Flynn:** It's inclined. Yeah. I I think it it concluded somehow that that meant they were considering le Yeah. So this is this is a great example of how we should interrogate these kind of things because statements like this if you can you imagine if you put something like this out to the customer you know it might backfire one of our events we never saw it. Yeah right well it goes back to reading all of these iterations super carefully because even though it is gigantically compressing the amount of time it takes for us to produce a rapid assessment it's human nature. I even told Msad at Temperman's at DFA because he said we're going to we're using AI a little bit to to get candidates for demand planning. Y and I told him every step you do read carefully all the recommendations and make sure they make sense. If you want me to vet any of it, send it over to me and I'll take a look at so you get a second pair of eyes. It was like AI can make you lazy because it produces all this and you're like, "Oh man, this is great." And you just take that as the gospel and you should not.

### **03:38:18** {#03:38:18}

**Michael Flynn:** Yeah. See, so then it gets into like a phase one without with just text, no table yet. So five five items from the foundation install baseline at Netsweet EPM to see where the performance these we saw in the last topic we talked about and it has emphasized three times already. So you think that so I mean it it seemed to think that this is like a lowhanging fruit and we should just do it and yeah what are we trying to do? Seems like we've got like this is it's including it in the intro. Like it's almost like it's including into the intro. for the people that don't read the old but yeah. No, but I'm I'm just saying u it's saying 24 to 40 hours. What What are you planning? What was that about? It asked us about the hours and I said just put something in as a placeholder. So, I wouldn't really Oh, it's for the five five items. Five items for the phase one to do next week at 8 p.m.

### **03:39:18**

**Michael Flynn:** Get a baseline to repair the PO or purchase clearing process automate month. It's all those things. Those five items are covered in that phase one preliminary. I do think phase one details will be at the bottom. I think we're going to get a table at the bottom. No, we haven't got So then we get into decision needed to start approves fave one. So business. It does look a little out of line now. Why did you put phase one information before business? That's a good question. I think that's bad. In fact, the verbose thing that I said I think I usually like this intro is actually just this one here. Yeah, like a show that we understand who you are and we understand who we met. That's what I like to be a little pleasant and verbose. Um uh we saw this you know how shiny operates today channels fulfillment this is this is good. Yeah I think is this is this correct? Yeah, as I'm reading through it, 90% was right.

### **03:40:21** {#03:40:21}

**Michael Flynn:** Channels were right. Um, city connect. Yeah. Accounting. No. Yeah. They don't have even one world or subsidiaries at all. They don't even have one world. There were no subsidiary anywhere. Where subsidiary? That is so you know uh I didn't even think you could buy that anymore. No. No. We were FMW was like that. But then actually in our renewal they forced us to convert over. That's right. Because they didn't charge us that you can't be in this baseline system anymore because at some point we're going to force you to go over. You might as well do it when when it's easy. Yeah. So I think that might be one thing you might because they're on the enterprise level in terms of but they didn't have one. It's it's literally apparently a check box on their side for them. Okay. Um um is that correct? They have they're using all customuilt cil flows. Yeah.

### **03:41:18** {#03:41:18}

**Michael Flynn:** So they have not used any so they're not using like the guy who was on the phone with us, right? Nick. Yeah. Nick White. He's he's their guy and he just all does all their development and he was proud to say that he didn't use out of the box because he said that China's process if I remember correctly I think he said maybe if you dug deep into this is China the reason they didn't use the Shopify connector is because they have a subscription model which was not working well with the Shopify connector. I I don't know any details about that. I I don't know any either. I mean, most of the way Shopify subscriptions work is it just autocreates your sales order for you, which should just work fine. That's right. Exactly. In fact, I asked him saying, "So I am I assuming that your subscription process is managed by Shopify and that Netswuite is not even aware of the concept of subscriptions." And they said, "Yes, they're not using any subscription billing systems inside of Netswu, which again, we're not here to solution, but might also be why they're not doing customer deposits if you because that's probably harder to do on manual flows than it is on the app. So there's a workaround for that." the subscription they do in the tree.

### **03:42:29**

**Michael Flynn:** They put a non-inventory item line item and then they put it to defer revenue and then and the reclassified it's a complicated way of doing it. God, but my question was not just the order flow they have customized. All the flows are customized like even the inventory flow, the product flow, even if the subscription was order flow could be customized but what they even they're not using anything else any they're using but not out of the everything is custom. No, that's what I'm saying. They're not using a connector. Yeah. I almost wonder if they use the template instead of the integration app because the template comes with base flows but you can change whatever you want. Oh, that could be what they did. I mean, is there such a thing as a Shopify B? You're in charge of it. It's not advantage at all. I mean, it's all you. I don't want to speculate. It sounds like he just got this in his head and just went with it.

### **03:43:18**

**Michael Flynn:** Like yeah, I'm just every I've seen multiple subscription plugins for Shopify and all of them just create a sales order at the time at the scheduled time. You don't need accounting visibility on your subscription details in that which if you're not charging them until you send them the order, you don't. Yeah. Which I guess you could argue is not really a subscription. It's just a recurring order. No, but even even like I'm saying you may need it for financial account, but that that's easy to get out of Shopify. Well, I guess the question would be what if somebody pays for a year subscription up front, which is not how most of them that I've seen work, but that would you would want to account for that differently. I think I think look, I I don't even know. The only subscriptions that I know about Shopify is to encourage people to just get orders automatically, right? and they charge you when you get the ordered and it's a way to grab people who are not paying attention and just get s\*\*\* mailed to them.

### **03:44:20** {#03:44:20}

**Michael Flynn:** You know what I mean? You know how long you probably you got you got an underwear for elephants. I'll give you two more over lions and tigers. Right. All right. So, this this section looks pretty good then. It did a nice job here. That's a That's a big number. Is that true? That is. Yeah. And it's causing some problems. Individual for each order in netswu it's causing problems. Wow. Under one Oh, yeah. No, no, no. Individual customers. So, if they're running a customer report or something like that, it it's big. Like we were just talking about, it'd be a problem if it was one customer. Anyway, the the the answer might just be better report writing where you're not trying to pull every customer into a or use MCP to write your reports for minutes because entire customer or something. So Justin's answer is right. Just have a time period where they get inactivated after a period of time for people who've not ordered anything.

### **03:45:24**

**Michael Flynn:** Yeah. No one. So, one of the challenges that I've experienced with a connector is if you inactivate Oh, that's right. Fails because the account number won't still can't be duplicated. Yes. Yeah. Because we have a similar So, you you you may have to just put like a inactive customs and then exclude them out. Wait, I mean if they got custom flows, they can probably freaking create error handling for that. Yeah, I know. But or you just triggers another somebody in active for now places next year. Yeah. Because it essentially uses external ID or something as the customer that I've seen and so uh I mean even we at FM we have a lot of customers because there's just over time it just accumulates. Not everybody really though but I just I just do a filter saying if the customer had an order for two years don't include them in the report. Yeah. So, we've got some verified numbers. 988,000 sales orders and roughly 1 million cash sales in fiscal 25\. A sample week in June, 227 2,227 cash sales per day, consistent with their reporting.

### **03:46:32** {#03:46:32}

**Michael Flynn:** That's nice verification. They had 3,000 orders per day on average. Wow. That's a lot of elephants. Lot of elephants in a lot of people ordering this s\*\*\*. a lot of I mean I'm telling you like they they've hit on it on Instagram, dude. Bombardi Bombardi is shipping 3,000 orders a day and those things ain't cheap and that's a scam. That is a stupid scheme. At least at least if I'm nothing fake jewelry inside a bathroom. It's ring bomb and costume jewelry. People have YouTube live channels where they drop this bomb. It dissolves and shows reveals this jewelry piece for which is usually just network marketing. So it's multi. Yeah, it's all it's a multi-level marketing. It's like cracks. At least if I order something from Shiny, they're not going to ask me to sell it to my friends. Those are good though. All right. System landscape verified in Netswuite, Celiggo, SPS Commerce, 10 trading partners, five dock types, new order, and a live market time integration for wholesale, a full but dormant RF smart install, custom WMS.

### **03:47:46** {#03:47:46}

**Michael Flynn:** Oh, fistban. So, this is actually a partner that wants to talk to us. What is fisban? Don't know. Oh, gotcha. Gotcha. Gotcha. And now what are So they have a dormant RF smart implementation, right? Yeah. So they they use which is accurate, right? Yeah. At some point in so they paid for it and that's just it. Did they ever like configured or No, they used it also but then they stopped using I asked them about that remember in the thing and they said well the reason we did that was because we just couldn't get it to work the way we wanted. So we did develop a whole I guess this programmer created whatever and it's mobile enabled. Yeah, it does kind of sounds like a job security thing but to be honest that does it always like I don't know what you're doing in your warehouse that it's Nick White. The owner's name is white be his brother. Yeah. Really?

### **03:48:43**

**Michael Flynn:** He just said Nick White. I was like one of the owners named White. Yeah. The brother or the brother-in-law like give me a job. All right. Aaron Condrin. Remember that dude? So, this all looks right. Payments back spanning eay, solay, versa. That seems like a lot. Well, solay verse are the same thing. Cyber source. Cyber source. That's a good question. One thing I thought was was good that the slides didn't say was the whole thing about the silo flows being all custom. Yeah, I think that was a good kind of important note. Yep. I'm wondering does this uh is did the system so they have all this stuff in the AI system recognize that there is just too many layers of everything right too many scripts too many everything it it actually so so far it hasn't actually called out that we're reading it as too many by looking at the list it has not said that explicitly anywhere that I've seen I thought it said like oh was temperament okay sorry I'm confusing yeah yeah uh so what We verified we connected to this shinasty production account through readonly role and confirm the identity employee domain scripts highlights that the client admin can recheck against their own account.

### **03:49:59** {#03:49:59}

**Michael Flynn:** RF smart is installed but dormant market times live. This you said never came up at all. Did they explain why RF smart was not used in detail in your conversations? because it's the reason that they they have not completely deleted it from the system is because there's still some fields that they're using they referring to for reporting or some purpose. So I don't know if that means they're going to have to continue to pay for license. Yeah, because I'm wondering there was if the RF smart menu is there, they're still paying for the license, right? Even if one they are paying for it, I would think so. I mean, obviously you don't have to my some of my So, some good things here. This is probably the closest it's come to saying it's a bit too much. I think it did say that. A 29 script e pay auto billing suite, a sol. What is e pay? defense. Uh Uh, Nimbus is the is the payment processor they used.

### **03:51:01** {#03:51:01}

**Michael Flynn:** I think the previous name was eBay or the company that was eBay. So, eBay and Nimbus are same. What is it though? Payment processor. Payment processor like like payment for customers or payment to vendors. Oh, what is it? What is this for? Auto billing kind of means to me customer. Yeah. But then we have a sol pay payment gateway. So if they have Shopify, why are they doing all this? Well, they do have some wholesale. It's but it's small. 90%. They have wholesale too. Yes. Yeah. Members is wholesale. Sorry. Because the customers use Nimbus to pay and that takes 15 minutes instead of few seconds because it goes entire customer history before they can make the payment. But then Nimbus Versa Pay at least those two that seems redundant for 10% of your business. That's we don't can't need two payment. And then it mentioned cyber source as well.

### **03:52:01**

**Michael Flynn:** Again, I don't want to solution this. I just want to try to verify. No, but it's good to know the context because see if this thing got it right. Yeah. Right. Yeah. No, it got it right. They have all these listics for Nimbus is the main one. Uh engine is wonder are they related to some of the the third party wholesale platform like New Order and stuff like that. Are they related to that? Could be. That might be why. Okay. So a fpan banking layer and a superseded current and a current plus a superseded ramp integration um which is expenses. What we could not verify the connected role uses deliberate narrow uh account identity and setup tables return this this is garbage. It we shouldn't put this we could shouldn't put this in just saying the MCP can't see X Y and Z. Not even entirely sure it did the right query. So this section what we cannot verify and why is not uh I don't think there's any value to this pain points uh each painoint below carries its evidence here.

### **03:53:15** {#03:53:15}

**Michael Flynn:** Is there a way is that still relevant context that could be rewarded as not something that you know is we can't my concern is that it's not even right and that's just however it tried to do the sweet QL query might be wrong um account identity and setup tables company information subsidiary account classification department record not found so we could not directly pull the netsweet release version it should be able to see those values. Yeah. All right. Wholesale allocation and commitment loss. Committed stock is stripped from wholesale orders even after the item has been picked. All right. This sounds like something that's truly happening. Yeah. Something you guys did capture. Separately short shipped purchase orders left open cause a new wholesale order to allocate against stale quality instead of the net. Okay. You know, once it's committed and allocated, it should not move. That's not just Kelly, that's everybody. That that should be the case. So, something's happening. Uh e-commerce overselling.

### **03:54:26** {#03:54:26}

**Michael Flynn:** We talked about this may just well again we don't want to go into the solutioning but their inventory sync might actually be the problem. Um discount handling Shopify new order allow order level and line level discounts at the same time. Netswuite cannot why not can what allow order level and line level discounts at the same time. I've never heard of that. Is this true? I thought it Yes, we can do it. I don't know whether it's discovering this or somebody that was said out loud. Saying this AI is saying this or it's saying the transcript said that at the same time we cannot allow what Shopify new order allow order level and buy level discounts at the same time. It says reported. So this sounds like it came from a so custom script converts every dollar. Yeah. So this is something what a power discount would do, right? But I mean I I'm just questioning the first sentence. Shopify new order allow order level and line level discounts at the same time.

### **03:55:31** {#03:55:31}

**Michael Flynn:** Netswuite cannot. Why? Who says next week cannot? Depends on I would ask it say like you said it says reporting reporting. So it wasn't like it was verified. Correct. So where did that come from? Yes we can ask that. Yeah. So so they are doing I don't know about the gloocommer and um netswuite integration if it brings this both. But he is doing it himself through a custom script. Okay. Which our product can also connect and something he doesn't have to maintain. So that's where power I recommend power. So that's what our script does, right? Line level and header level without adding. So the wholesale payment latency, this is what you were talking about because it loads every customer. Unfortunately, well, I won't even get into this is something we may or may not be able to help with because we're not in control of it. Though, if we can cut down the customer list somehow. Um, exchange rack can a cash sale,

### **03:56:28** {#03:56:28}

**Taha Raja:** Exchange exchange creates a cash sale that

**Michael Flynn:** a refund, and a new sales order that are meant to net out but are very hard to tie back to the payment processor.

**Taha Raja:** are the payment process. All right.

**Michael Flynn:** All right, sounds like a real problem that was reported.

**Taha Raja:** Sounds like a real problem that was reported. Silent payment

**Michael Flynn:** Silent payment feed check failures. Wholesale customers created through a public monday.com form

**Taha Raja:** failure

**Michael Flynn:** arrive with incomplete address data that causes payment attempts to fail with no alert. Uh so we got another thing in here. Like why they're basically using a to create customers. Why don't they use Asa? I know. I mean, monday Monday.com is just a better Asana. So, I don't know. It seems like the wrong tool for the job. But yeah, I think anyways, not trying to sales and customerf facing, right? They can customer can put in their details. Purchase clearing when a product bill and its item rece both hit one clearing account and every movement is matched by hand.

### **03:57:22** {#03:57:22}

**Michael Flynn:** Uh vendor prepayments is not used. Bill import fragility. Primary vendor bill import uh is a single fragile custom flow that breaks warehouse performance and unused diagnostic dormant smart retail kiosk gaps. Warehouse scanning cycle counts are not enabled at kiosk locations which just maybe record a report. financial segmentation um needs to looks like it's just not Amazon settlement wreck deferred revenue I mean if they're using deferred revenue it sounds like they are taking funds upfront which is not how I usually see Shopify used fixed asset issue no native fixed asset module both run on spreadsheets late postings after close after ARAP log transactions still post suspected to be integration uh close duration. So this these sound like real captured accurate issues and then we've got a list wholesale allocation pain solution preliminary LOE pain I like I like did that uh the first one had like Uh, Discovery right there. Discovery 48 hours and build TVD. Yep. I do like that. 48 hours. So, so it didn't put them in a table, but it is creating a list, which to be honest, we've when we talked about the the rapid assessment template, y we went back and forth.

### **03:59:10** {#03:59:10}

**Michael Flynn:** I kind of don't why I like this view sometimes because it gives the same amount of data. Sometimes the table gets gets jumbled. Yeah, that's a fair point. And I there now we did cut down the columns to do like a a title and a description in one cell, but it's still kind of jumb. It still kind of gets bunched and I think it's easily it's readable like this. No, I think we can tweak it. Whatever. I'm not locked to it, but I do I don't mind this layout. I think. So, I'm gonna kind of skip through these. We I I'll have a we'll have Claude compare the task list to what your task list is. Um, is there anything else? How big is this document? Oh, and here now we now we have a summary of estimated hours. We also got Oh, so this is an interesting model. So, so it gave itself more room to type about each issue up here and then just put the parts that don't require a big blob of text in the table to look at it.

### **04:00:11**

**Michael Flynn:** That's kind of a good compromise. Yeah. So, you kind of get the best of both worlds. You can look at the list and get the general idea what now switching up and down. Oh, eight hours for what? Okay, let me go up and read eight hours. Yeah, we could hyperlink them um within the document. I think you should document it both places. Well, it is it is documented. All of that information is documented above. It's just it's just a both places then it's fine. Yeah. So So here's what we have for every task numbered. Yeah. If it's in every task numbered and then some summary at the bottom. I think that's the the item, right? The priority near-term, the hours. Yeah. Yeah. And the then the meat in the middle is the verbose description of what the pain is, what the solution is. I'm not I mean I'm not committed to it, but I don't mind the way it was done.

### **04:01:10** {#04:01:10}

**Michael Flynn:** Uh preliminary sum of the ranges with a firm number excludes all TBD is 100 to 150 hours. Again, we're not expecting that to be right. This is a floor, not a projected total. the discovery le items. Uh we'll add hours confirmed after discovery. I think this is goes back to your point about this not really being a rapid assessment because we just did the remote sessions. So we upfront on the when we're doing upfront sessions, we should probably be explicit that we are like who we did a good job of explaining to somebody that this was the case. I forget who it was. It was the case that after the discovery, after the assessment, because they chose not to do a full on-site rapid, we will not have 100% firm LOEs that some of the topics will get deferred and say require additional discovery, which to be fair is almost the case in in almost every account even if we went on site for three days and still need time to dig into more. Yeah, I I think that's fair.

### **04:02:15**

**Michael Flynn:** So we that'll be part of the sales. We'll just make we'll do we'll try to do a good job of communicating that. But I think um proposed phasing these are okay. Um risks and assumptions areas needing deeper discovery. Open questions and next steps. Confirm what wholesale flow uses the live market time integration. provide netswuite release version. That's shouldn't matter. Full examples of transactions posting after period locked. These are pretty good. These are some of these are decent like action items although you could argue they don't belong. ong in this dock. They should belong in like the discovery meeting or the planning of that meeting. Billing and rates. This is an Anderson Frank project. So, and then we've got an appendix of what was there. Okay. Um so point by point let's do let's have Claude do the comparison of point over point um documents current project you compare these two uh So, this is the local drive.

### **04:03:54** {#04:03:54}

**Michael Flynn:** You see me ask Maria how Rod's feeling was about the the reworking sandbox. Okay. I didn't tag your name. I commented in the channel. I said how I let Taha know about the sandbox refresh and how we'll need to rework. It looks like it came up on the call today. Was Rod okay with it? Because I I sent it both to Brian. is to make sure Rod knows that this is going to be additional work. I then forwarded it to Rod. But you need to write an email. I forwarded it to Rod. I'm sorry I didn't. I waited to talk to you. But I will also came up today, but that's why I want to know what came up on the call so I can use that in the email. Yeah, write a formal email. Copy me on it and that way we you know, let's see how we respond to it. Yeah, I'm curious. But that's why I asked her because it came up on the call.

### **04:04:39** {#04:04:39}

**Michael Flynn:** It says it in the notes document. I think it should be. So I was like, "All right, let me Rod saying that it was our I only saw the summary where it had an action item for me to do in the transcript. Okay. So it came up. What did he say about it? I think we should not read the transcript and have to figure that out. But in fact, I'm going to Yeah. Not going to read it. So what are we doing now? I'm actually so we we kind of eyeballed it and went through it and I'm going to come back and ask a little bit about it but I want to go have Claude go through it as well for content. What is your assessment of this document versus the one you created? So the board missed the very first point to talk here but after my when I asked to go back and look at set the payment payout flow and the order conversation then it picked it up.

### **04:05:36** {#04:05:36}

**Michael Flynn:** So this and this one we did not ask so of course that's missing here right I I think my version is the tablo version uh the template we have all agreed on kind of yeah and much shorter than this one in terms of content besides those two points I think it covered in fact it covered more And more by words or more by actual content? Content. And so what were the contents that it covered that you did not cover? There were a lot of sections which I did not even have. No, but se again you're not getting my point. You you cannot have sections but you covered the topics effectively enough in a shorter document which I'm favoring. Yeah. Longer document does not mean good quality. Yeah. So I have to go back and look at it. So I'm having it that that'll that should come up in this one. It should be able to compare like meat to meat like what is in there. Yeah. Because I you know the other thing also is guys is you know generating a 20page document in today's world people just don't have the bandwidth to cover that stuff.

### **04:06:43**

**Michael Flynn:** So honestly we need to train our AIS to be succinct and to the point. So I I think one one thing that this already has the capability of do to do that is to use an example document as a template, right? So if so that's what my prompt does, right? Because we have a template and an ID document now. So but is the template for formatting or is the template for content creation? Formatting. Formatting. That's not that's not what we're talking about because the content is coming from the transcript saying no no no but that's not what I'm talking about. See I think what he's talking about is that template guides them saying well you know look at this document and see how succinct and to the point it is and generate content the same way because the thing is you could generate stories and be 20 pages long and your client just loses focus. Yeah. So I I mean I I think both are important. I probably actually meant it more the way Iran was thinking about it like formatting I I mean I do care about it but in this particular exercise I think it's important to say you know put yourself in a customer's shoes.

### **04:07:54**

**Michael Flynn:** Okay maybe I'm using the wrong word or you're using the same word differently. When I say format I'm saying I need these five sections formatted this way. This is automatically controlling how much content you need to add. wrote has like five other headings and sections repeating the same thing in a different way, right? Like if I ask what are people wearing in this room, there like 20 different ways to say that casual office wear versus one is wearing a hat, one is wearing shorts. You can go like in so much detail, right? Absolutely. And AI does a lot of it. I was like, dude, this document is never ending. It is all right information, but do I need it? No. And I think it's important that you are, you know, in a rapid assessment document. I remember when I used to create these manually, you know, for the most part, it was basically a very comprehensive table of all the issues and each issue was summarized in two to three sentences.

### **04:08:47**

**Michael Flynn:** Yeah, that's what our company is. And so, you know, honestly, you guys the only thing and and I mean you could summarize in one maybe two paragraphs your understanding of the company then immediately dive into the issues. Yeah. Because the thing is by the time you have done a pre-sales call an internal kickoff a customerf facing kickoff and been on site for two and a half days we're done with the pleasantries right the customer need wants you to get down to brass tax and say tell me what are you going to do about it? Yeah. What I do exactly I know what I do. Yeah. I mean I think it needs to be presented in a very succinct form because then remember the objective here we're just accomplishing the easy part which is creating a document. We all know AI does great job doing it. We just need to fine tune it. Now it's about taking that and feeding it into an agent that will help us make solutions. Whether it's going in there and making tweaks, whether it's deploying scripts, whatever it is, because that's really the heavy lifting that we're talking about, right?

### **04:10:03** {#04:10:03}

**Michael Flynn:** So there's two things to think about. Is it possible that the rapid assessment because the thing is everything has to get connected in order for the AI to continuously keep track of what's going on. So is the customerf facing document maybe separate from context and content that the project system will need to continue to work on the project. I don't know, right? And is is that is that something we need to think about of how AI works or is the raw content that it derived the document from good enough for it to continue to do the change with the fact that it knows here's the topics that I got to work on, you know. Yeah. And as you guys say that the rapid assessment document is just still a guide document. actual work starts after that once we pick up task or sprints get into more deep dive conversation create asana tickets and that's where the real work starts right yeah and honestly you know once you have defined the script uh sprints you guys tell me because you guys have worked on asylum more what is your process to start asylum tasks MCP do it yeah but is that is that I mean I mean I'm asking a question would that be okay in a more refined way yeah I think Okay.

### **04:11:31**

**Michael Flynn:** At least you're talking long longterm MCP replacing asana. Is that what you're saying? Sorry. No, no, no. Using MCP to push in tasks like we did. We created the rapid assessment that 50 tasks. Why am I gonna type those in? So, you used MCB to then create Yeah. Yeah. Yeah. I didn't have You're already making a lot of truthfully. Truthfully, I may the first time I did it, I might have used the CSV. I'm not I forget to be honest. I did it with all that is a great use of has AI built into Oh, I don't know. I haven't touched. Yeah. Yeah. Yeah. We're connected to it. That's not good. Really? It means you do not updated. You hate us. I hate now. I just know never to ask you a question. I mean, I'm not really responsible for any projects. It's not Yeah, you are.

### **04:12:32**

**Michael Flynn:** You better not say that question. Yeah. No, but I I'm I'm curious because I' I've used this on as AI as well. And I wonder if you even at this stage, if you gave it the rapid assessment documents and create a project out of it, how would it would Oh, yeah. Yeah. Oh, yeah. I didn't do that. Oh, if you go right through the bathroom here. If you rotate right from there, you'll see right down here. No, right in that door and straight. Yeah. Go through the Go through the mail room. I'm going through the mail. Okay. You'll see it right now, right? Because I think you can you can have like if you don't have a mailbox. Yeah, we were in the process of buying textes. is picking up in Texas a lot, right? Or maybe it's because of flat. I don't know. My brother does all my real estate. So, he does flex pay or does he does real estate?

### **04:13:30**

**Michael Flynn:** He just does real estate, managing real estate for our family. That's all he does. Yeah. So, he he had a healthcare ERP company. He sold it to Oh, that's the brother. I forgot. Mustafa. Yeah. Mustafa. Yeah. He does other, right? What? Our school. Our school. School. Yeah. So, real estate is like, does he do full-time or is like he's got a license, but he doesn't sell to anybody else except he does his own and just buys and sells his own. So, yeah, that's all. Yeah. Pay fees, pay proper fees, right? like you said if you sell like software this is just to keep yourself busy which is good I mean at some point but he was he was telling me this these things are way which healthcare ERP so he there's one in Charleston no he he he did epic yeah that Epic has an office in Charleston pro I don't know I think they do and so he was he was an alliance partner for Epic and uh so that's all he did and uh then IBM I'm almost positive they do because I I think I came across some I forget now but yeah so he he he sold out to Epic and then the I mean sorry IBM global services IBM global services sold that to Mahindra which is an Indian company and now Mahindra

### **04:14:55**

**Michael Flynn:** called it back to do just consulting like he he just advises that one thing. So he does that part time as well. So both your brothers are in technology. What kind of tech? Well, only one of my brothers. I only other brother. Yeah. You said both of my brothers. I said two brothers. Both of you. Yeah. Yeah. Is Hussein around? Uh yeah, he's he's in town, isn't he? Yeah. Yeah. I was just curious. I was like, "Oh, I mean, I've never met him in person. I don't know what we put our plans after dinners and s\*\*\* like that." You can call him and see if he wants to meet with you. He don't want to meet with me. He's probably losing money on that. I don't think so. I don't get through last time. Same way. You can push that back in. It's gonna lower the seat so people slide in table.

### **04:16:03** {#04:16:03}

**Michael Flynn:** So it's making a comparison document now. Yeah. Or am I just I think it's just going to compare them here. These are not two drafts of the same document. No kidding. Um we didn't say that. Yeah. Is organized around 21 index. Don't care. Don't care about the PDF is clearly later resolves open questions that the document leaves hanging. What is PDF? What is doc? Um, one was a doc and one. Mine was the PDF. Yeah. So, mine's back. All right. So, let's see. Contradictions. Yellow. I don't I should have told it the yellow is not right. Um, discounting is the only line with ownership of the payment portal. Fix doc x scopes power cloud to audit the portal. PDF says the fix is primarily on the vendor side. It scopes power cloud for advisory. These are different commercial commitments. Loop returns dock list loop as Shopify plus Netswuite return authorization automation says Loop automates return off between Shopify and Netswuite.

### **04:17:12** {#04:17:12}

**Michael Flynn:** PDF says Loop has no netswuite footprint and operates entirely kind of both, right? I say they're not both not really wrong. So that's the thing with it's not wrong but is it right? Yeah. Uh RF smart where the document contra contradicts itself. The doc x exec summary rf sum is not being used. Not really wrong. The two statements cannot both uh is both systems appear actively maintained. I agree they both could stand actually completely disagree. Script count. Nice. Payment gateway. DocX call all four processors active. PDF flags unused gateways for deactivation. Did it? Well, we didn't go through the PDF too much in detail. So, oh, it might have in that in the in the actual task or whatever. Doc e-commerce is only 90% of revenue. PDF 90% of order volume. Um, oh, I guess that technically probably is important to be specific, but not I would guess I think it was 90% of the revenue% of the revenue is what from the conversation I remember I don't know the reports but all right because CFO they remember numbers not yeah payout import so the doc in the document in so in Iran's missing from the PDF payout import automation inventory packaging strategy social commerce settlement.

### **04:18:59**

**Michael Flynn:** So yeah the package inventory was also big on this. Okay we have to look into it. Um so that the number one is the payout. Remember we talked about it my option listed in the first attempt. I had to go ask go review the recordings and pick up this topic. Um inventory packaging is another one I had to dig. I think in my report also it's TBD. Okay. They have built like a super long custom workflow. Mhm. Uh which goes picks an order fulfillment required that comes into it looks in between two locations and picks up a certain location based on certain criteria. If it's not there then there's a transfer order automatically creates picks it from the other brings it to this location and then sends it out. Uh the reason is because the packaging is different for wholesale versus e-commerce or nonh wholesale but they don't want to lose an order. So this bring the order in, fulfill it if one location doesn't have a ticket from the other location.

### **04:19:52**

**Michael Flynn:** Okay. And it creates a PU in between and transfers that all that stuff that automated. That that's similar to what like Temper is doing and we're not talking about solutions, but that's something we have to for like they have a distribution center. So if I place an order in a a non-distribution location, they transfer it to that location and that's all automated. So are these would you consider this to be true misses on your document? So no these are missing on the AI document. Oh PDF. Okay. I was PDF is the AI document. Okay. Your both are AI doc. Sorry. Yes. The one we built today. Do you recall whether you had to iterate to get this? So the layout I had to iterate the inventory packaging was there in my first uh I can't remember what was a social settlement conversation dedicated scripts already exist. The document explicitly frames this as a separate reconciliation work stream from the payment processor which it it would be PDF mentions Tik Tok only as a channel name has no work item.

### **04:20:56**

**Michael Flynn:** Yeah, I know this 18 script first time they exist. All right. So, so the so the first sentence is is yours apparently. JP Morgan versus Fispan never worked through. Oh, maybe not. So, let let me ask this what to customers like customer how how do we bring consistency where because to me this list is pretty big. Yeah. For it to be this big of a difference. So what could we do to make sure that we get consistent powerg yeah I suggested powerg that's why I asked this question powerg always has a demand there they go a bit of reclassification not just influenced as some other because of segmentation they move from one segment to another for us but we'll get into I think going back to your question I this is where the human in the loop comes into bit right I the calls I've been the I' the one who have heard that's a good I'd like to be a little closer though. Yes, that was my point is how do you how do you get closer?

### **04:22:02**

**Michael Flynn:** Because even even think of it from a workflow stand, right? And and and correct me if I'm wrong. If I am I just got back from a trip, right? Two, three days worth of conversation. There's no way I would remember all the details, although I would have general context, right? I have the recordings, I have the transcripts, I'm giving it to an AI. It generates a document. I may read it now unless there was a topic that was a gross mism miss, right? Something that we talked about for an hour and a just missed it. You probably would remember that. But there are some finer points you may not remember that you even had that conversation unless you read all the transcripts. And if the AI also missed it, it gets all missed all together. Yeah. Right. So what do we do? Is there an iteration to to do where you know maybe you use a different model or because here here's the other thing the other conflict in this whole comparison is the fact that we're using the same model.

### **04:23:04** {#04:23:04}

**Michael Flynn:** Yeah. What do you mean by model? Sorry. LLM or or cloud is we're just using cloud in this. Another big thing is I think we haven't compared the prompt which generates the report for that's a very big Yeah, I was going to say that too because you might have iterated across it a couple times. Yes. And I used the template which we have in the Yeah, maybe that's the maybe that's the first comparison. Yeah. You basically said I'm done. Go. So here's what I want to do and get set up for maybe our our work trying this again tomorrow working through this. I want to take you I want to take your prompt from the the one you guys worked on together and your example document. I'm going to take these differences and say, "Hey, We like the briefer document, right? We want this to be less verbose. We want to make sure that all possible tasks are captured. Here's what was missed by each one.

### **04:24:13** {#04:24:13}

**Michael Flynn:** Here's what prompt they used. Do you have what prompt we used? Let's try to like how can we improve this process? Um, basically I'll let that run overnight. I'll update the MD files and then we can try to run this again tomorrow. Yeah, I love the idea. I mean, that's why I was asking earlier like we're essentially refining the the the MD files that Well, here's the thing. I I want I want this process. So, remember the objective here is ultimately we want to build our tool, right? Mhm. The tool needs to have these checks and balances kind of built in. Yes. Right. And so this becomes kind of our exercise. Well, what are these things? Right. Because like I said, I know for a fact when I used to go on site, okay, we didn't even freaking record back then. We were taking notes and I know for sure there were things that were missed that would come up down.

### **04:25:17**

**Michael Flynn:** So just as an example, can you remember how big of a document we produced for Red Camera? Oh yeah. Didn't you say it was likeund and something pages? Oh, it might have been more than that. Yeah, was gigantic. Like you could it was measurable. Like I remember even doing my first one with you out at uh at GLCO. Yes. and them going, "Man, you're doing a lot of typing." I was trying to capture everything and then it two days to organize everything that I typed and it's impossible to catch everything. Yeah. And and you know, the thing is it's impossible unless you have a Yeah. person who is doing this court reporter. There's no way to stenographer. Right. I mean, you you would know in the past you would you would have missed. But in this situation now, yep. Now we have a synographer. Now we have a synographer but now we have an AI who is making an assumption saying oh I don't think this is important.

### **04:26:15** {#04:26:15}

**Michael Flynn:** Yeah. So, Imran, I want I know I'm asking you a little bit from memory here, but couple of things it says you were missing. First one's the one that I think matters. Late postings after period lock seemed like that was something real, right? Um, transaction posting after close was unknown suspected integration driven. No one in the closed integrity issue and argued. So, I had a question when we that that came up with yours. How does that even happen? Is it like you're you lock AP and AR but you don't close the period maybe or you allow or No, you can do late post. So here the thing is there are two ways to do that in Netswuite, right? You can it's nonposting G and something transactions. No, no. You you can have it open for journals only. So you can say, hey, somebody is doing the it's period soft lock. That's one option. If that's the case, I don't I don't know. But if it's completely locked, I can post it on the date in the lock period, but the posting period is followed.

### **04:27:20**

**Michael Flynn:** Oh, that okay, that makes sense, right? So then what happens? But the period That's right. So you know that way if somebody says well when was this invoice it was on this date but we had to post it on the next period because so financial reporting will show it to be posted on the next period. But if you do an aging if it was an invoice if you do an aging report and if your aging report is based on date transaction date transaction date then it'll show that it has aged from the date of the invoice. I think Upwood Projects has that problem because they get they get AP invoices like three months later and if you're not careful in how you run these different reports, you can get a mismatch between your financial statement and your aging report, I think. Yeah. Yeah. It's like their trial balances don't match aging, something along those lines, which is a common issue if they're doing exactly this. Anyway, so I mean, was that I mean, I know this was a long, but was that discussed?

### **04:28:18**

**Michael Flynn:** Yeah, the topic was discussed. Um so that's another thing if it's relevant enough to even put it in any either document even if one or other will not miss it. Um I don't remember being like a significant issue and though those were journals not transactions because they do a lot of journal adjustment journals towards the reclassification journals and all. Yeah. Um but yeah it was discussed it must be in the transcript but I don't think it was relevant enough to put it in the like not everything discussed has to go in the document somewhere. Yeah, but that's the judgment call you would have to pick. That's the human in the loop, right? So, so yeah, I remember that conversation. But even if one document missed or I don't think it was another example which was in my document, not in this. Here's one thing. Here's one thing about that kind of comment regarding a something that was an issue but maybe it wasn't important. If AI catches that, it would be good to put that as supplemental thing.

### **04:29:19** {#04:29:19}

**Michael Flynn:** Hey guys, we also noted these things as a future. That way it's it goes into as a task. It becomes a reminder for future business once you finish the primary stuff. You know it's remember two objectives. You always want to generate more work with them, right? And it's like okay well now that we've completed 20 different things here's another 10 that were low priority but now could be high priority. I was reading the way I was reading that was like a ship lock is it's it exists in the system but needs to be retired is what it is. They don't use it like RSR, right? Okay. It just didn't seem like it was. is that it probably wasn't talked about as much as our smart and that's why I kind of skipped it. So my document edited the other document yesterday and either ways it's not but it's not a big a big deal anyway but what I was thinking is that it's good to have so after you have this assessment you might have 20 or 50 page you don't want to make a 50 page document focus on the big ones because the customer is also taking the big issues not each and every issue so in the document you don't need those big 10 15 but that itself takes like months But in the same time you also want this supplemental because just remember it maybe after 3 months

### **04:30:37** {#04:30:37}

**Michael Flynn:** once we you know mix bring some good results they're like happy bring it up those smaller ones too. Oh by the way we're discussing this. Yeah. So it should be with us. I don't think it needs to go in the document but how do we store it and present it as as a as a topic. I think it's fair. Or again, put it in the document in a in a in a in a less verbose section like, hey, these are fast follow items. There's way less detail. There might not even be an LOE on it, right? There might not even be an LE. It's just a brief sentence. Let's address these later. Yeah, something like that. Yeah. So can I take the rising words because every customer comes to us whether unless it's a new brand new implementation whether it's an implementation fixing the ones rescue ones have like two three very urgent things yeah they're concerned about they want to see progress while there's always other wish list which they only care about once the big ones are done the main ones are sorted.

### **04:31:35** {#04:31:35}

**Michael Flynn:** Yeah. All right. So, what I want to do is I want to let today's transcript of our call here happen and get some of our feedback. Um, I want to use that as to make sure that I'm just not trying to capture every thought feeling we had about what we're trying to do inside a prompt. Um, I will include some of this, but I'll I'll talk about what we like about your document, what we like about the other document. um the verboseness and of course the missing of things and the I'll just go back and forth a little bit do a little bit of brainstorming about not yeah comp I'll compare could you uh should be in that the prompt that we we I used so the the prompt in the template file that you guys build could you just I know it's in a chat somewhere can we just surface it in the AI if you just put it at the top of the AI summit for me. Yep. I'll just take a little bit of time tonight and do that and then uh talk about what changes we're making in the morning and then we kind of rerun some of this so at a high level this tool is intended to be used kind of throughout the process from Even sales process to the prep for on-site uh the possibility there is no on-site uh

### **04:33:07**

**Michael Flynn:** and uh the rapid assessment uh after on-site based on all of the or implementation requirements gathering. It hopefully should work with either. Well, we Yeah, we talked about the two classes that we talked about thus far, which is kind of the existing implementation that maybe needs u for lack of a better word, rescue or however you want to word that. Yep. Versus they're going from QuickBooks to Netswuite or one previous system to So, and really it shouldn't end there. Now, we haven't got to that point today. There's a reason we're here all week. I agree. Um, we want to that we want to ultimately take this and create an account configuration project and and you know for like uh that's what we'll probably use the 44 example for is we'll create an account customization that sets all of the enable features and everything like that. And then we'll get into something that creates some records andor changes some the changes are going to be a little bit harder to emulate because we may not have you know we need a we need a system that is broken that we need to be able to fix.

### **04:34:22** {#04:34:22}

**Michael Flynn:** It's a little bit harder to do in a conference room with a theoretical u setting. We'll talk. Maybe there's something we can try in some of these sandbox that's not working. I don't know. Um, but let's but let's see if we can at least get it to produce a structured project that would actually make a change to something that we that we come up with. You know, that's probably of course all these are well at least that last piece is predicated upon an MCP connection. Cor so the last piece actually won't happen through MCP that will happen through sweet SDF sweet cloud development framework. Okay. That is where you can build a set of scripts a set of netswuite options a set of custom fields and records and push it into an account. I got you. Gotcha. Gotcha. Okay. That's what the SDFs you were talking about. Now it's possible it would be a combination of both. If we want to actually enter a record or something like that, that would happen through MCP.

### **04:35:26** {#04:35:26}

**Michael Flynn:** Yeah. No, I like the SDF because it means even if we don't get access through MCP, we're still in business. Wait, didn't use STF on the spring training which we made it outside of like in cloud code like I did. It really sure at least mine yours worked was through the MCP, right? There was no SDF or maybe you build SDF and then still used MCP to send it into SDF connection pushes it up. Yeah. So when you do, if you remember, you do something called like sweet cloud account setup and sweet cloud like verify and stuff like that. Anytime you're starting with that sweet cloud command, you're doing SDF. Okay. It technically is completely independent of MCP. You don't Yeah, exactly. I'm able to push Well, I'm not, but able to push a change to Temperman's using M SDF. Like if I need to create a new field, I wouldn't do it this way, but create a new field, I can push it in via SDF from cloud from cloud without having an MCP connection.

### **04:36:26**

**Michael Flynn:** So how it's an SDF connection. SDF connection. Yeah. So when you say SDF when you say sweet cloud account setup it it like something happens behind the scenes but it pops open a browser you have to log in granted permission close it. It records some kind of credential token. It's just an O token is what it is. There's an OOTH token. It's the same thing that you're doing when you connect cla it's going, "Hey, Netswuite, do I have access to use this thing?" You go, "Yep." And it goes, "Okay, thanks." Yeah. But it's MCP and SDF are separate. Yeah, they're two different things. So, all right. Why don't we pause here? I think that's a good place. We're at Well, it's 4:59, so it's a good time as well. Um, I have the homework tonight. I think I I think I can if you guys can get me that. I don't think I need anybody else to do anything other than think about today.

### **04:37:24** {#04:37:24}

**Michael Flynn:** I' like to start tomorrow by rerunning this. We only have part of a day tomorrow. Um, tomorrow is day two. We are going till 1:00 in the afternoon. So, I might kick off a second iteration of this overnight tonight just so that we have something to start talking about and we don't have to wait for it tomorrow. Um, one thing I do want to get better at doing, we did an okay job of it today. If we do kick off, Claude, and wait for it, let's move on to another topic and then come back to it. We shouldn't ever be staring at the screen. I don't think we did that much today, but we talk about other topics at the same time, but let's just uh make sure that we do that. And uh so tomorrow we're going to be I believe we're starting at 8\. Yeah, we can start whenever we want. So, let's first of all talk about tomorrow. I know tomorrow afternoon we kept it for flexibility for you guys to do work.

### **04:38:25**

**Michael Flynn:** Um, we can start a little later and go a little bit later if you don't have calls. If you do have calls, we can start at 8 and finish at 1\. I think I moved all mine. That's what I'm saying. Yeah. I mean, the only so the only call I have still on here is the 44 Pro executive call, which is when? One o'clock. Okay, we can take that and then yeah, even if we even if we started later in nine and go to two, but we take a 20 minute break to call him. Yeah, it's completely up to you guys. I know having time having time to build starting at 8\. You're okay with starting at 8? I'm definitely okay starting at 8\. As far as as far as how long we go, I'm going to leave it to you guys. You guys Yeah. And then look after we do the call if if if people want to still talk about this and continue. We have the room till 5 and we want to maximize obviously the time here to kind of get as much done as possible because some of this content will be the framework to start working on some of the stuff for tools for power cloud.

### **04:39:33** {#04:39:33}

**Michael Flynn:** Some of it will be basis to share with the team members to say here's how you do it in the interim and so on so forth. But again, our intention was to provide time where you guys can manage the customers, get billable hours and not completely take you off for this week. So, I want to be respectful of that. And yes, if that's what you guys want, great. If you'd rather just keep pushing through, then there's plenty to talk about and try. I mean, I I I kind of I kind of want to just get on the or I don't need a lot of time. Well, hopefully. Yeah. But I I do want to kind of make sure that I don't want to leave it four days till I get back to that Shopify stuff. You know what I mean? So let's let's go as the plan scheduled. If you feel different tomorrow, just say so. We can always change on Thursday. Yeah. And but let's just go with the scheduled plan tomorrow.

### **04:40:21**

**Michael Flynn:** Y perfect. What time do you guys fly out on Friday? I fly out at three. 4:06. I think it's three. Yeah. So, uh, yeah. I mean, if you customer, you won't you'll have to leave. Yeah. Yeah. So, I, uh, yeah, we're pretty far from the airport. It doesn't feel like we're in the same state. Never mind city. You're far from Houston in Houston. Well, we're we're not in Houston, right? We're in Houston diameter wise is now the largest city in the United States. But does Houston is that ranch? My home now is in city of Houston. It is. Oh, is it really? Oh, you're no longer in the uninorated. Oh, s\*\*\*. When did years ago? And my taxes fell down by another 3/4 of a percent, which is great. My taxes, total property tax is less than $5,000 now. But actually, so you're also not in KDISD from property taxes.

### **04:41:20**

**Michael Flynn:** No, KDIS. So, they have shared revenue sharing for that purpose. Oh, gotcha. They've got a so annexures by city of Houston are have these agreements with the independence district. Oh, gotcha. Gotcha. So Houston has lower tax than Kat. Well sold.

**Taha Raja:** taxes go down. One is if you join a municipal water supply system and mud taxes are paid, all that goes away. Mud taxes, municipal utility district, right? So if you have if you have mud taxes because it's a new development they have to put mud tax because you usually get a 20 or 30-year bond to bring utilities to that development. That 30-year bond gets paid off. You don't owe those money anymore. So, my home is old enough that's been paid off. That's Yeah. 30 years. What's that one you said? So, then if you get annexed by the city of Houston, you join the municipal I mean their water supply system and their way of managing.

### **04:42:26**

**Taha Raja:** You don't have to hire a private company because the city manages your water and that lowers your taxes. Why? Like who was your one who was your water company before? It was infraark or something like that. Oh, really? Yeah. Now, are you still or were you ever uh how was this paid in the past when Katie decided to build, you know, $80 million high school stadium? Was that was that coming out of property taxes? Oh, yeah. Property taxes to a bond. Yeah. Yeah. A bond that went Yeah. 808 million high school football stadium with with luxury box. Does that go does that have to go to a vote? Oh yeah. Okay. And of course people the problem is people don't even know what they're voting for. You read some of these bond uh bond issues on the ballot. It's like I think I need a lawyer to decipher this s\*\*\*. Is it like a prop two and a half type of type of over similar type of situation?

### **04:43:22**

**Taha Raja:** So in mass if you ask for more like at least in this current climate like everybody fails like so you like it's like oh we don't we have a speestous in the fire department your taxes have to go up $75 a year to build a new fire station like nope I'm not a firefighter that's literally what happened like some guy got up at town meeting when we were like talking about the fire new fire station and it's like what are we supposed to do we're supposed to build the new fire station every 75 years. A reasonable number just closed down central fire station after like dinner or anything else. I can do dinner at Nope. It's up to you guys. I'm at home so it doesn't really matter one way or the other. I think Richmond is just down the road. He's in Richmond, but his address is in Richmond. Well, that's what I'm asking is if y'all are if y'all are going to have dinner, then then it's probably easier for me to stay on side of town rather than drive all the way home and drive all the way back.

### **04:44:27**

**Taha Raja:** I'm gonna have dinner at some point. I can get to that. Yeah. I don't uh I can be on my own. It can be with a group. I know we're here for multiple days. Uh you are wanting to join for dinner. Where are we going? I don't know. We can. That's a classic response. Houston has amazing food, man. I don't want to Houston has an amazing restaurant. Houston has this is an opportunity. I've never come to Houston and for three days and do nothing. Right. It's usually go to the airport, go back. I always wish about going to SS. But I never end up going. But yeah. Yeah. When I say good, I mean. I can suggest a few things on the chat and then we can make a decision. And there's places in Houston and there's places probably in Katy that you're much better aware of.

### **04:45:10**

**Taha Raja:** Sugarland. Sugarland. Everything is Yeah. What is today? Monday, right? Oh yeah. Sugarland as well. Know so many spots. I just put on him. Yeah. He's a foodie though. He goes he eats every day, right? So he's not like What's that? He eats every day. Not halal, but he has a good list of halal. Oh, yeah. No, is not bound by halal or anything. Not even remotely. Yeah. He doesn't eat pork though. He won't eat pork. I guarantee you that has snuck a hot dog every once. That's true. That's true. I I don't doubt that. He says he says he doesn't eat pork, but I don't know. I don't believe that. I mean, I believe he does that regularly. Yeah. I think it's the other way. He doesn't like avoid it either, but he's like not looking for it.

### **04:46:02**

**Taha Raja:** Yeah. You know, like both are the right correct statement. It's just like Yeah. All right. So, if y'all are doing dinner, do you all have an idea when you're doing dinner? Because it affects whether I'm driving all the way back over to catch or whatever. So, you know, we um I would probably say, well, what time do you guys want to eat? It doesn't matter. I We could al we could do tonight. We we also don't have to do night. So we're here three nights, right? So if another night is better for anybody, that's fine. I got nothing sitting on mid hotel. Whose anchor is that? That's nice. Anything around it? Nothing. Walmart is pretty close. Everything is available because he only need stuff when you go towards uh I 10\. There's a bunch of stuff there and uh so it's really close. It's like literally five minute drive. Yeah. But where you are right now there is no there's hardly any now 20 minutes south is amazing in Sugarland.

### **04:47:08**

**Taha Raja:** It's got I have my car. I can drive you. Yeah, he has a car. But I need a company because they drive Indian food. You need company to eat. I cannot order. I'll do that. Yeah. Did you drive? Yeah, from Austin. It's not a bad drive. Good guy. I totally enjoyed it. I'm just glad I didn't get straight to 71 and 71\. Yeah. Yeah, it's easy. Yeah, it was a good drive. Um I want Yeah, I just want to go to the gym for a little while. All right. So, I'm gonna head back into Russia. Well, it's going to be okay, I think. Right. It's It's better than It's better than coming out the tollway. It'll be No, it's better than going out. But it's still I think the west. Yeah. Yeah. From here. This morning I was coming from the warehouse.

### **04:48:15**

**Taha Raja:** So, so it picked me out the uh the toway coming off of I clear out the room if we have anything. Do we have anything else? Yes. I want to let him know to leave this stuff here because that's his Yeah. All all that stuff is back back to the hotel. Yeah. And I'll let you know. I'll pick you guys up or you guys meet us because you guys have a car. Yeah. So just give me or just post in chat post. It's Tuesday. We got tacos. If you uh there is a has opened at Kia. or is it good? I haven't been to it. If you guys want to eat a lot of meat, there is a which is really nice place. It's a Brazilian. Oh. Oh, I sure. We can go there, too. Uh, probably sevenish. I'll put it up there in the chat in a few minutes after I get home and then you guys vote. Good. We'll meet him tomorrow. Okay, thank you so much.

### **Transcription ended after 04:53:13**

*This editable transcript was computer generated and might contain errors. People can also change the text after it was created.*

[image1]: <data:image/png;base64,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>
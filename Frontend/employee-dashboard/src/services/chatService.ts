export interface ChatMessage {
  id: string;
  text: string;
  isBot: boolean;
  timestamp: string;
}

const HR_KNOWLEDGE_BASE: Record<string, string> = {
  leave: 'To request leave, contact your HR Manager (Jane Doe) or raise a request. If you are logged in as a Manager, you can approve or reject leaves directly inside your **Approvals** portal tab.',
  sprint: 'Our current focus is **Sprint 24**, ending *July 5, 2026*. Major objectives include finalizing the Logisoft Core HR Portal refactoring, checking security guards, and deploying AWS pipelines.',
  leader: 'Your assigned Team Leader is **John Smith** (Tech Lead, Software Engineering). You can check team allocations and workloads under the *Team Board* dashboard tab.',
  role: 'Logisoft HRMS supports three access tiers: **Employee**, **Team Lead**, and **HR Manager**. Tiers inherit features from lower levels automatically.',
  budget: 'Department budgets are managed by the HR Manager. The Software Engineering department is currently allocated **$150,000** for Q3 operations.',
  policy: 'All employee operations are governed by our standard security policies. Workstation logs are audited weekly. For details, contact HR support.',
};

export const chatService = {
  /**
   * Simulates sending a user prompt to an HR assistant API endpoint with a network delay
   */
  async sendMessage(prompt: string): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const query = prompt.toLowerCase().trim();
        
        if (!query) {
          return reject(new Error('Prompt cannot be empty'));
        }

        // Search matching key in our simulated knowledge base
        for (const [key, answer] of Object.entries(HR_KNOWLEDGE_BASE)) {
          if (query.includes(key)) {
            return resolve(answer);
          }
        }

        // Default response if no keyword is matched
        resolve(
          "I'm sorry, I couldn't find a direct match for your question. I can assist you with **leaves**, **sprints**, **team leaders**, **system roles**, or **budgets**. Try clicking one of the suggestions below!"
        );
      }, 1200); // 1.2s delay to show the typing indicator
    });
  },
};

export default chatService;

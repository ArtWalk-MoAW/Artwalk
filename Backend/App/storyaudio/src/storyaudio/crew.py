from crewai import Agent, Task, Crew, Process
from crewai.project import CrewBase, agent, task, crew
from typing import List
from crewai.agents.agent_builder.base_agent import BaseAgent
from crewai import LLM
import json

llm = LLM(
    model="ollama/llama3",
    base_url="http://host.docker.internal:11434", 
    temperature=0.7,
)

@CrewBase
class StoryAudioCrew:
    agents: List[BaseAgent]
    tasks: List[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    @agent
    def audio_writer(self) -> Agent:
        return Agent(
            config=self.agents_config["audio_writer"],
            verbose=True,
            llm=llm
        )

    @task
    def script_task(self) -> Task:
        return Task(
            config=self.tasks_config["script_task"]
        )

    @crew
    def crew(self) -> Crew:
        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.sequential,
            verbose=True
        )

from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai import LLM
import litellm


litellm._turn_on_debug()



llm = LLM(
    model = "ollama/llava",
    base_url = "http://host.docker.internal:11434",
    temperature= 0.2,
)


@CrewBase
class ClassifyImage():
    """ClassifyImage crew"""

    agents: List[BaseAgent]
    tasks: List[Task]
    agents_config= "./config/agents.yaml"
    tasks_config= "./config/tasks.yaml"

  
    @agent
    def visual_analyzer(self) -> Agent:
        return Agent(
            config=self.agents_config['visual_analyzer'], # type: ignore[index]
            verbose=True,
            #tools=[LLavaTool()],
            llm=llm
        )

    @agent
    def refiner_agent(self) -> Agent:
        return Agent(
            config=self.agents_config['refiner_agent'], # type: ignore[index]
            verbose=True,
            #tools=[LLavaTool()],
            llm=llm,
            #output_file='../report.md' # Specify the output file for the agent's results
        )


    #Analyzes the image and trys to give back the artist and the title of the artwork
    @task
    def analyze_task(self) -> Task:
        return Task(
            config=self.tasks_config['analyze_image'], # type: ignore[index]
        )

    @task
    def refine_description(self) -> Task:
        return Task(
            config=self.tasks_config['refine_description'], # type: ignore[index]
            output_file='refined_output.json'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the ClassifyImage crew"""
       

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )


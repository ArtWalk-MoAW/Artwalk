from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai import LLM
# If you want to run a snippet of code before or after the crew starts,
# you can use the @before_kickoff and @after_kickoff decorators
# https://docs.crewai.com/concepts/crews#example-crew-class-with-decorators



llm = LLM(
    model = "ollama/llama3",
    base_url = "http://host.docker.internal:11434",
    temperature= 0.1,
)


@CrewBase
class DetailAgent():
    """DetailAgent crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    agents_config = "config/agents.yaml"
    tasks_config = "config/tasks.yaml"

    # Learn more about YAML configuration files here:
    # Agents: https://docs.crewai.com/concepts/agents#yaml-configuration-recommended
    # Tasks: https://docs.crewai.com/concepts/tasks#yaml-configuration-recommended
    
    # If you would like to add tools to your agents, you can learn more about it here:
    # https://docs.crewai.com/concepts/agents#agent-tools
    @agent
    def art_researcher(self) -> Agent:
        return Agent(
            config=self.agents_config["art_researcher"],
            verbose=True,
            llm=llm
        )
    
    @agent
    def image_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config["image_analyst"],
            verbose=True,
            llm=llm
        )
    

    @agent
    def era_expert(self) -> Agent:
        return Agent(
            config=self.agents_config["era_expert"],
            verbose=True,
            llm=llm
        )
    
    @agent
    def similarity_curator(self) -> Agent:
        return Agent(
            config=self.agents_config["similarity_curator"],
            verbose=True,
            llm=llm
        )
    @agent
    def reporting_analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['reporting_analyst'],
            verbose=True,
            llm=llm
        )

    # To learn more about structured task outputs,
    # task dependencies, and task callbacks, check out the documentation:
    # https://docs.crewai.com/concepts/tasks#overview-of-a-task
    @task
    def artist_task(self) -> Task:
        return Task(config=self.tasks_config["artist_task"])

    @task
    def image_task(self) -> Task:
        return Task(config=self.tasks_config["image_task"])

    @task
    def era_task(self) -> Task:
        return Task(config=self.tasks_config["era_task"])

    @task
    def similarity_task(self) -> Task:
        return Task(
            config=self.tasks_config["similarity_task"],
            
        )
    
    @task
    def final_report_task(self) -> Task:
        return Task(
            config=self.tasks_config['reporting_task'],
            output_file='final_art_report.json'
        )

    @crew
    def crew(self) -> Crew:
        """Creates the DetailAgent crew"""
        # To learn how to add knowledge sources to your crew, check out the documentation:
        # https://docs.crewai.com/concepts/knowledge#what-is-knowledge

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
            # process=Process.hierarchical, # In case you wanna use that instead https://docs.crewai.com/how-to/Hierarchical/
        )

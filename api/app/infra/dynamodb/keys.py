class DynamoDBKeys:
    @staticmethod
    def pk(workspace_id: str) -> str:
        return f"WORKSPACE#{workspace_id}"

    @staticmethod
    def workspace_sk() -> str:
        return "META#WORKSPACE"

    @staticmethod
    def host_sk(host_id: str) -> str:
        return f"META#HOST#{host_id}"

    @staticmethod
    def job_sk(host_id: str, job_id: str) -> str:
        return f"META#JOB#HOST#{host_id}#{job_id}"

    @staticmethod
    def host_prefix() -> str:
        return "META#HOST#"

    @staticmethod
    def job_prefix() -> str:
        return "META#JOB#"

    @staticmethod
    def job_host_prefix(host_id: str) -> str:
        return f"META#JOB#HOST#{host_id}#"

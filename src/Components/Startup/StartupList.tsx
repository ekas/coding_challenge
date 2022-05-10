import { Card, CardContent, CardHeader, Grid } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import { StartupHttpService } from "../../Http/Startup/Startup.http.service";
import { Startup } from "../../Types/Startup";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import usePagination from "./usePagination";

export default function StartupList(): ReactElement {
  const [startups, setStartups] = useState<Startup[]>([]);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const count = Math.ceil(startups.length / PER_PAGE);
  const _DATA = usePagination(startups, PER_PAGE);

  const handleChange = (e: any, p: any) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    StartupHttpService.getStartups().then((startups) => {
      return setStartups(startups);
    });
  }, []);
  return (
    <Grid id="startup-list" container direction="row" spacing={2}>
      <Stack spacing={2}>
        <Pagination
          count={count}
          size="large"
          page={page}
          variant="outlined"
          shape="rounded"
          onChange={handleChange}
        />
      </Stack>
      {_DATA.currentData().map((startup: Startup) => {
        return (
          <Grid
            item
            xs={12}
            key={startup.id}
            data-cy={"startupId-" + startup.id}
          >
            <Card>
              <CardHeader
                title={`startup.name ^ ${startup.id} --- `}
                subheader={`Founded: ${startup.dateFounded.getFullYear()}
                    ${
                      startup.employees
                        ? " | " + startup.employees + " Employees"
                        : ""
                    }
                    ${
                      startup.totalFunding
                        ? " | " + startup.totalFunding + " Mio. $"
                        : " | Funding Undisclosed"
                    }
                     ${
                       startup.currentInvestmentStage
                         ? " | " + startup.currentInvestmentStage
                         : ""
                     }`}
              />
              <CardContent sx={{ pt: 0 }}>
                {startup.shortDescription}
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
}

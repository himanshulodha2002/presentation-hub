"use client";

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { data } from "@/lib/constants";
import { Project, User } from "@prisma/client";
import NavFooter from "./nav-footer";
import NavMain from "./nav-main";
import RecentOpen from "./recent-open";

const AppSidebar = ({
    recentProjects,
    user,
    ...props
}: {
    recentProjects: Project[];
} & { user: User } & React.ComponentProps<typeof Sidebar>) => {
    return (
        <Sidebar
            collapsible="icon"
            {...props}
            className="max-w-[212px] bg-background-90"
        >
            <SidebarHeader className="pt-6  px-2 pb-0">
                <SidebarMenuButton
                    size={"lg"}
                    className="data-[state=open]:text-sidebar-accent-foreground"
                >
                    <span className="truncate text-primary text-xl font-semibold">
                        {" "}
                        Presentation Hub
                    </span>
                </SidebarMenuButton>
            </SidebarHeader>
            <SidebarContent className="px-2 mt-10  gap-y-6">
                <NavMain items={data.navMain} />
                <RecentOpen recentProjects={recentProjects} />
            </SidebarContent>
            <SidebarFooter>
                <NavFooter prismaUser={user} />
            </SidebarFooter>
        </Sidebar>
    );
};

export default AppSidebar;
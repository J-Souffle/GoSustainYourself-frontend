"use client"

import { MailIcon, PlusCircleIcon, type LucideIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
          <SidebarMenuButton
  tooltip="Quick Create"
  style={{
    backgroundColor: "rgba(0, 180, 0, 0.5)", // Green color with 50% opacity
  }}
  className="text-black rounded-md p-2 duration-200 ease-linear hover:bg-yellow-700 active:bg-green-800 hover:text-purple-500"
>

              <PlusCircleIcon />
              <span>Quick Create</span>
            </SidebarMenuButton>
            <Button
              size="icon"
              style={{
                backgroundColor: "rgba(0, 180, 0, 0.5)", // Green color with 50% opacity
              }}
              className="h-9 w-9 shrink-0 group-data-[collapsible=icon]:opacity-0 hover:text-purple-500"
              variant="outline"
            >
              <MailIcon />
              <span className="sr-only">Inbox</span>
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                tooltip={item.title}
                style={{
                  backgroundColor: "rgba(0, 180, 0, 0.5)", // Green color with 50% opacity
                }}
                className="bg-blue-500 text-black duration-200 ease-linear hover:bg-blue-600 active:bg-blue-700 rounded-md p-2 hover:text-purple-500"
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
